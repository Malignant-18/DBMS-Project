import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';interface Candidate {
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
  name: string;
  position_id: number;
  position_name: string;
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  created_by: string;
  created_at: string;
}

interface ElectionResults {
  election: Election;
  candidates: Candidate[];
  totalVotes: number;
  winner: Candidate | null;
}

const Results: React.FC = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();
  const { state } = useAuth();
  const user = state.user;

  const [results, setResults] = useState<ElectionResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!electionId) {
      setError('Invalid election ID');
      setLoading(false);
      return;
    }

    fetchElectionResults();
  }, [user, electionId, navigate]);

  const fetchElectionResults = async () => {
    try {
      setLoading(true);
      
      // Fetch election details
      const electionResponse = await fetch(`http://127.0.0.1:5000/election/${electionId}`, {
        credentials: 'include'
      });

      if (!electionResponse.ok) {
        throw new Error('Failed to fetch election details');
      }

      const electionData = await electionResponse.json();

      // Fetch candidates with vote counts
      const candidatesResponse = await fetch(`http://127.0.0.1:5000/election/${electionId}/candidates`, {
        credentials: 'include'
      });

      if (!candidatesResponse.ok) {
        throw new Error('Failed to fetch candidates');
      }

      const candidatesData = await candidatesResponse.json();

      // Process results
      const totalVotes = candidatesData.reduce((sum: number, candidate: Candidate) => sum + candidate.total_votes, 0);
      const sortedCandidates = candidatesData.sort((a: Candidate, b: Candidate) => b.total_votes - a.total_votes);
      const winner = sortedCandidates.length > 0 && sortedCandidates[0].total_votes > 0 ? sortedCandidates[0] : null;

      setResults({
        election: electionData,
        candidates: sortedCandidates,
        totalVotes,
        winner
      });

    } catch (err) {
      console.error('Error fetching election results:', err);
      setError(err instanceof Error ? err.message : 'Failed to load election results');
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (votes: number, total: number): number => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  const formatDateTime = (dateTime: string): string => {
    return new Date(dateTime).toLocaleString();
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ongoing': return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'upcoming': return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      case 'completed': return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading election results...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Results</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <div className="space-x-3">
            <button
              onClick={() => navigate('/election-management')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Elections
            </button>
            <button
              onClick={fetchElectionResults}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h1 className="text-2xl font-bold text-white mb-2">No Results Available</h1>
          <p className="text-gray-400 mb-4">Unable to load election results</p>
          <button
            onClick={() => navigate('/election-management')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Elections
          </button>
        </div>
      </div>
    );
  }

  const { election, candidates, totalVotes, winner } = results;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/election-management')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Election Results</h1>
              <p className="text-gray-400">{election.position_name} - {election.name}</p>
            </div>
          </div>

          {/* Election Info Card */}
          <div className="border border-gray-800 rounded-lg p-6 mb-8 hover:border-gray-700 transition-colors duration-200" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(election.status)}`}>
                  {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Total Votes</h3>
                <p className="text-2xl font-bold text-white">{totalVotes}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Candidates</h3>
                <p className="text-2xl font-bold text-white">{candidates.length}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Election Period</h3>
                <p className="text-sm text-gray-400">
                  {formatDateTime(election.start_time)} <br />
                  to {formatDateTime(election.end_time)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Winner Announcement */}
        {winner && election.status === 'completed' && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-600/30 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">🏆</div>
                <div>
                  <h2 className="text-2xl font-bold text-yellow-400 mb-1">Winner Declared!</h2>
                  <p className="text-yellow-300">Congratulations to the newly elected {election.position_name}</p>
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-yellow-600/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{winner.candidate_name}</h3>
                    <p className="text-gray-400">{winner.reg_no}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-400">{winner.total_votes} votes</p>
                    <p className="text-sm text-gray-400">{calculatePercentage(winner.total_votes, totalVotes)}% of total</p>
                  </div>
                </div>
                {winner.manifesto && (
                  <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-gray-300 mb-2">Manifesto:</h4>
                    <p className="text-gray-400 text-sm">{winner.manifesto}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="border border-gray-800 rounded-lg overflow-hidden" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Detailed Results</h2>
          </div>

          {candidates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-xl font-medium text-gray-300 mb-2">No Candidates</h3>
              <p className="text-gray-400">No candidates registered for this election</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Votes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Vote Share
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {candidates.map((candidate, index) => {
                    const percentage = calculatePercentage(candidate.total_votes, totalVotes);
                    const isWinner = index === 0 && candidate.total_votes > 0 && election.status === 'completed';
                    
                    return (
                      <tr key={candidate.candidate_id} className={isWinner ? 'bg-yellow-600/10' : 'hover:bg-gray-800/50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-lg font-bold ${isWinner ? 'text-yellow-400' : 'text-white'}`}>
                              #{index + 1}
                            </span>
                            {isWinner && <span className="ml-2 text-xl">🏆</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className={`text-sm font-medium ${isWinner ? 'text-yellow-400' : 'text-white'}`}>
                              {candidate.candidate_name}
                            </div>
                            <div className="text-sm text-gray-400">{candidate.reg_no}</div>
                            {candidate.manifesto && (
                              <div className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={candidate.manifesto}>
                                {candidate.manifesto}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-lg font-semibold ${isWinner ? 'text-yellow-400' : 'text-white'}`}>
                            {candidate.total_votes}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${isWinner ? 'text-yellow-400' : 'text-gray-300'}`}>
                            {percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${isWinner ? 'bg-yellow-500' : 'bg-blue-500'}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Election Statistics */}
        {candidates.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors duration-200" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
              <div className="flex items-center">
                <div className="text-3xl mr-4">📈</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Voter Turnout</h3>
                  <p className="text-2xl font-bold text-blue-400">{totalVotes}</p>
                  <p className="text-sm text-gray-400">Total votes cast</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors duration-200" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
              <div className="flex items-center">
                <div className="text-3xl mr-4">🎯</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Leading Margin</h3>
                  <p className="text-2xl font-bold text-green-400">
                    {candidates.length > 1 
                      ? candidates[0].total_votes - candidates[1].total_votes 
                      : candidates[0]?.total_votes || 0
                    }
                  </p>
                  <p className="text-sm text-gray-400">Vote difference</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors duration-200" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
              <div className="flex items-center">
                <div className="text-3xl mr-4">⚖️</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Competition</h3>
                  <p className="text-2xl font-bold text-purple-400">
                    {candidates.length > 0 && totalVotes > 0
                      ? Math.round((1 - (candidates[0].total_votes / totalVotes)) * 100)
                      : 0
                    }%
                  </p>
                  <p className="text-sm text-gray-400">Non-winner votes</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate('/election-management')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Election Management
          </button>
          <button
            onClick={() => window.print()}
            className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Print Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;