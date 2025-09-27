import React, { useState, useEffect } from 'react';

interface Candidate {
  id: number;
  name: string;
  description: string;
  image?: string;
  votes: number;
}

interface Election {
  id: number;
  title: string;
  description: string;
  club: string;
  candidates: Candidate[];
  deadline: string;
  hasVoted: boolean;
  isActive: boolean;
  totalVotes: number;
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
        <h3 className="text-xl font-semibold text-white">{election.title}</h3>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          election.hasVoted 
            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
        }`}>
          {election.hasVoted ? 'Voted' : 'Pending'}
        </span>
      </div>

      {/* Election Details */}
      <p className="text-gray-400 mb-4">{election.description}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm text-gray-500">
        <div>
          <span className="text-gray-400">Club:</span>
          <p className="text-white font-medium">{election.club}</p>
        </div>
        <div>
          <span className="text-gray-400">Total Votes:</span>
          <p className="text-white font-medium">{election.totalVotes}</p>
        </div>
        <div>
          <span className="text-gray-400">Candidates:</span>
          <p className="text-white font-medium">{election.candidates.length}</p>
        </div>
        <div>
          <span className="text-gray-400">Deadline:</span>
          <p className="text-white font-medium">{new Date(election.deadline).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Voting Section */}
      {!election.hasVoted && (
        <div>
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

          {/* Candidates List */}
          {expanded && (
            <div className="space-y-3 mb-6 transition-all duration-300">
              {election.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedCandidate === candidate.id
                      ? 'border-white bg-gray-800/50'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => onCandidateSelect(candidate.id)}
                >
                  <div className="flex items-start">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 mt-1 flex-shrink-0 ${
                      selectedCandidate === candidate.id
                        ? 'border-white bg-white'
                        : 'border-gray-600'
                    }`}>
                      {selectedCandidate === candidate.id && (
                        <div className="w-2 h-2 bg-black rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-white mb-2">{candidate.name}</h5>
                      <p className="text-gray-400 text-sm">{candidate.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vote Button */}
          {expanded && (
            <button
              onClick={onVote}
              disabled={selectedCandidate === null || voting}
              className="w-full bg-white text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer"
            >
              {voting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  Casting Vote...
                </div>
              ) : (
                'Cast Vote'
              )}
            </button>
          )}
        </div>
      )}

      {/* Already Voted Message */}
      {election.hasVoted && (
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
    </div>
  );
};

const Voting = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockElections: Election[] = [
      {
        id: 1,
        title: "Student Council President Election",
        description: "Vote for the next Student Council President who will represent all students.",
        club: "Student Body",
        deadline: "2024-01-15",
        hasVoted: false,
        isActive: true,
        totalVotes: 245,
        candidates: [
          {
            id: 1,
            name: "Alice Johnson",
            description: "Computer Science major with 3 years of student government experience. Focused on improving campus facilities and student services.",
            votes: 89
          },
          {
            id: 2,
            name: "Bob Smith",
            description: "Business Administration student passionate about student welfare and academic excellence initiatives.",
            votes: 76
          },
          {
            id: 3,
            name: "Carol Davis",
            description: "Engineering student advocating for better technology resources and sustainable campus practices.",
            votes: 80
          }
        ]
      },
      {
        id: 2,
        title: "Tech Club Leadership",
        description: "Select the new leadership team for the Technology Club.",
        club: "Tech Club",
        deadline: "2024-01-20",
        hasVoted: true,
        isActive: true,
        totalVotes: 89,
        candidates: [
          {
            id: 4,
            name: "David Wilson",
            description: "Full-stack developer with experience in organizing tech workshops and hackathons.",
            votes: 45
          },
          {
            id: 5,
            name: "Eva Brown",
            description: "AI/ML enthusiast focused on bringing cutting-edge technology education to students.",
            votes: 44
          }
        ]
      },
      {
        id: 3,
        title: "Cultural Committee Head",
        description: "Choose the head for organizing cultural events and festivals.",
        club: "Cultural Committee",
        deadline: "2024-01-25",
        hasVoted: false,
        isActive: true,
        totalVotes: 156,
        candidates: [
          {
            id: 6,
            name: "Frank Miller",
            description: "Arts student with extensive experience in event management and cultural programming.",
            votes: 62
          },
          {
            id: 7,
            name: "Grace Lee",
            description: "Music and theater enthusiast committed to diverse and inclusive cultural celebrations.",
            votes: 58
          },
          {
            id: 8,
            name: "Henry Chen",
            description: "Photography and media specialist focused on documenting and promoting campus culture.",
            votes: 36
          }
        ]
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setElections(mockElections);
      setLoading(false);
    }, 1000);
  }, []);

  const handleVote = async () => {
    if (!selectedElection || selectedCandidate === null) return;

    setVoting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update election status
    setElections(prev => 
      prev.map(election => 
        election.id === selectedElection.id 
          ? { ...election, hasVoted: true, totalVotes: election.totalVotes + 1 }
          : election
      )
    );
    
    setSelectedElection(null);
    setSelectedCandidate(null);
    setVoting(false);
  };

  const activeElections = elections.filter(e => e.isActive);
  const completedElections = elections.filter(e => !e.isActive);

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
              Active Elections ({activeElections.length})
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
            <h2 className="text-xl font-semibold text-white">Available Elections</h2>
            {activeElections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                selectedCandidate={selectedElection?.id === election.id ? selectedCandidate : null}
                onCandidateSelect={(candidateId) => {
                  if (!election.hasVoted) {
                    setSelectedElection(election);
                    setSelectedCandidate(candidateId);
                  }
                }}
                onVote={() => handleVote()}
                voting={voting && selectedElection?.id === election.id}
              />
            ))}
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

export default Voting;