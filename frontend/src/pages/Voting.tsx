import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchCandidatesForElection, submitVote, checkVoteStatus } from '../services/candidateService';

interface Candidate {
  candidate_id: number;
  election_id: number;
  reg_no: string;
  candidate_name: string;
  manifesto: string;
  total_votes: number;
}

interface Election {
  election_id: number;
  club_id: number;
  name: string; // club name
  position_id: number;
  position_name: string;
  created_by: string;
  created_by_name: string;
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  result_declared: boolean;
  created_at: string;
  candidates?: Candidate[];
  hasVoted?: boolean;
  totalVotes?: number;
}

interface ElectionCardProps {
  election: Election;
  selectedCandidate: number | null;
  onCandidateSelect: (candidateId: number) => void;
  onVote: () => void;
  voting: boolean;
}

const ElectionCard: React.FC<ElectionCardProps> = ({ 
  election, 
  selectedCandidate, 
  onCandidateSelect, 
  onVote, 
  voting 
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all duration-200" style={{backgroundColor: 'hsla(0,0%,6.9%,1)'}}>
      {/* Election Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">{election.position_name} - {election.name}</h3>
        <div className="flex gap-2">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            election.status === 'completed'
              ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
              : election.status === 'ongoing'
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
          }`}>
            {election.status === 'completed' ? 'Completed' 
             : election.status === 'ongoing' ? 'Ongoing' 
             : 'Upcoming'}
          </span>
          {election.hasVoted && election.status === 'ongoing' && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ✓ Voted
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-400 mb-4">Election for {election.position_name} position in {election.name}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm text-gray-500">
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">Club</p>
          <p className="text-white font-medium">{election.name}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">Candidates</p>
          <p className="text-white font-medium">{election.candidates?.length || 0}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">Start Date</p>
          <p className="text-white font-medium">{new Date(election.start_time).toLocaleDateString()}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">End Date</p>
          <p className="text-white font-medium">{new Date(election.end_time).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Voting Section */}
      <div>
        {!election.hasVoted && (
          <div 
            className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-800/50 transition-colors duration-200"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-white">Select a candidate:</h4>
              <svg className={`w-5 h-5 transform transition-transform text-gray-400 ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}

          {/* Candidates List - Only show if user hasn't voted*/}
          {expanded && !election.hasVoted && (
            <div className="space-y-3 mb-6 transition-all duration-300">
              {election.candidates?.map((candidate) => (
                <div
                  key={candidate.candidate_id}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    election.status !== 'ongoing'
                      ? 'cursor-not-allowed opacity-60 border-gray-800'
                      : selectedCandidate === candidate.candidate_id
                      ? 'cursor-pointer border-white bg-gray-800/50'
                      : 'cursor-pointer border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => {
                    if (election.status === 'ongoing') {
                      onCandidateSelect(candidate.candidate_id);
                    }
                  }}
                >
                  <div className="flex items-start">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 mt-1 flex-shrink-0 ${
                      selectedCandidate === candidate.candidate_id
                        ? 'border-white bg-white'
                        : 'border-gray-600'
                    }`}>
                      {selectedCandidate === candidate.candidate_id && (
                        <div className="w-2 h-2 bg-black rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-white mb-2">{candidate.candidate_name}</h5>
                      <p className="text-gray-400 text-sm">{candidate.manifesto}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vote Button - Only show if user hasn't voted */}
          {expanded && !election.hasVoted && (
            <button
              onClick={onVote}
              disabled={selectedCandidate === null || voting || election.status !== 'ongoing'}
              className="w-full bg-white text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer"
            >
              {voting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  Casting Vote...
                </div>
              ) : election.status === 'upcoming' ? (
                'Election Not Started'
              ) : election.status === 'completed' ? (
                'Election Ended'
              ) : (
                'Cast Vote'
              )}
            </button>
          )}
        </div>

      {/* Election Status Messages */}
      <div className="mt-6">
      {election.hasVoted && election.status === 'ongoing' && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-400 font-medium">Vote Submitted</span>
          </div>
          <p className="text-green-300 text-sm">Thank you for participating in this election!</p>
        </div>
      )}
      
      {election.status === 'upcoming' && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-blue-400 font-medium">Election Upcoming</span>
          </div>
          <p className="text-blue-300 text-sm">This election will start on {new Date(election.start_time).toLocaleDateString()}</p>
        </div>
      )}
      
      {election.status === 'completed' && (
        <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-400 font-medium">Election Completed</span>
          </div>
          <p className="text-gray-300 text-sm">This election ended on {new Date(election.end_time).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  </div>
  );
};

const Voting = () => {
  const { state } = useAuth();
  const user = state.user;
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Fetch candidates for a specific election using the service
  const fetchCandidates = (electionId: number): Promise<Candidate[]> => {
    return fetchCandidatesForElection(electionId);
  };

  // Check if user has voted in a specific election
  const checkUserVoteStatus = async (electionId: number): Promise<boolean> => {
    if (!user?.reg_no) return false;
    
    try {
      // Use the service function to check vote status
      return await checkVoteStatus(user.reg_no, electionId);
    } catch (error) {
      console.error(`Error checking vote status for election ${electionId}:`, error);
      return false;
    }
  };

  // Fetch elections from backend API
  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('http://127.0.0.1:5000/election/all', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const electionsData: Election[] = await response.json();
          
          // Fetch candidates for each election and check vote status
          const processedElections = await Promise.all(
            electionsData.map(async (election) => {
              const candidates = await fetchCandidates(election.election_id);
              
              // Only check vote status for ongoing elections
              let hasVoted = false;
              if (election.status === 'ongoing') {
                hasVoted = await checkUserVoteStatus(election.election_id);
              }
              
              const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.total_votes || 0), 0);
              
              return {
                ...election,
                candidates,
                hasVoted,
                totalVotes,
              };
            })
          );
          
          setElections(processedElections);
        } else {
          console.error('Failed to fetch elections:', response.statusText);
          setElections([]);
        }
      } catch (error) {
        console.error('Error fetching elections:', error);
        setElections([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.reg_no) {
      fetchElections();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleVote = async () => {
    if (!selectedElection || selectedCandidate === null || !user?.reg_no) return;

    setVoting(true);
    
    try {
      const { success, data } = await submitVote(selectedElection.election_id, {
        reg_no: user.reg_no,
        candidate_id: selectedCandidate,
      });

      if (success) {
        // Successfully voted - update the election status
        setElections(prev => 
          prev.map(election => 
            election.election_id === selectedElection.election_id 
              ? { 
                  ...election, 
                  hasVoted: true, 
                  totalVotes: (election.totalVotes || 0) + 1,
                  candidates: election.candidates?.map(candidate => 
                    candidate.candidate_id === selectedCandidate
                      ? { ...candidate, total_votes: (candidate.total_votes || 0) + 1 }
                      : candidate
                  ) || []
                }
              : election
          )
        );
        
        alert('Vote submitted successfully!');
      } else {
        // Handle voting errors
        const errorMessage = data.error || data.msg || '';
        if (errorMessage.toLowerCase().includes('already voted')) {
          alert('You have already voted in this election.');
          // Update the hasVoted status for this election
          setElections(prev => 
            prev.map(election => 
              election.election_id === selectedElection.election_id 
                ? { ...election, hasVoted: true }
                : election
            )
          );
        } else {
          alert(errorMessage || 'Failed to submit vote. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('An error occurred while submitting your vote. Please try again.');
    } finally {
      setSelectedElection(null);
      setSelectedCandidate(null);
      setVoting(false);
    }
  };

  // Separate elections by status and prioritize ongoing first
  const ongoingElections = elections.filter(e => e.status === 'ongoing');
  const upcomingElections = elections.filter(e => e.status === 'upcoming');
  const completedElections = elections.filter(e => e.status === 'completed');
  
  // Combine ongoing and upcoming for active tab, with ongoing first
  const activeElections = [...ongoingElections, ...upcomingElections];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading elections...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please log in to view and participate in elections.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Elections & Voting</h1>
          <p className="text-gray-400">Cast your vote and make your voice heard</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="border border-gray-800 rounded-lg p-1 shadow-lg" style={{backgroundColor: 'hsla(0,0%,6.9%,1)'}}>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Active Elections ({ongoingElections.length + upcomingElections.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Completed Elections ({completedElections.length})
            </button>
          </div>
        </div>

        {/* Active Elections */}
        {activeTab === 'active' && (
          <div className="space-y-8">
            {/* Ongoing Elections Section */}
            {ongoingElections.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                  Ongoing Elections ({ongoingElections.length})
                </h2>
                <div className="space-y-6">
                  {ongoingElections.map((election) => (
                    <ElectionCard
                      key={election.election_id}
                      election={election}
                      selectedCandidate={selectedElection?.election_id === election.election_id ? selectedCandidate : null}
                      onCandidateSelect={(candidateId) => {
                        if (!election.hasVoted && election.status === 'ongoing') {
                          setSelectedElection(election);
                          setSelectedCandidate(candidateId);
                        }
                      }}
                      onVote={() => handleVote()}
                      voting={voting && selectedElection?.election_id === election.election_id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Elections Section */}
            {upcomingElections.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                  Upcoming Elections ({upcomingElections.length})
                </h2>
                <div className="space-y-6">
                  {upcomingElections.map((election) => (
                    <ElectionCard
                      key={election.election_id}
                      election={election}
                      selectedCandidate={selectedElection?.election_id === election.election_id ? selectedCandidate : null}
                      onCandidateSelect={(candidateId) => {
                        if (!election.hasVoted && election.status === 'ongoing') {
                          setSelectedElection(election);
                          setSelectedCandidate(candidateId);
                        }
                      }}
                      onVote={() => handleVote()}
                      voting={voting && selectedElection?.election_id === election.election_id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No Active Elections Message */}
            {activeElections.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Active Elections</h3>
                <p className="text-gray-400">There are currently no ongoing or upcoming elections available.</p>
              </div>
            )}
          </div>
        )}

        {/* Completed Elections */}
        {activeTab === 'completed' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Completed Elections</h3>
            <p className="text-gray-400">Completed elections will appear here once voting periods end</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Voting