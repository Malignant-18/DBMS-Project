import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { checkVoteStatus } from '../services/candidateService';

interface HomeElection {
  election_id: number;
  position_name: string;
  name: string; // club name
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  totalVotes: number;
  candidateCount: number;
  hasVoted: boolean;
}

const Home = () => {
  const { state } = useAuth();
  const user = state.user;
  const [activeElections, setActiveElections] = useState<HomeElection[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch elections data
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
          const electionsData = await response.json();
          
          // Process elections and add vote status and candidate count
          const processedElections = await Promise.all(
            electionsData
              .filter((election: any) => election.status === 'ongoing' || election.status === 'upcoming')
              .sort((a: any, b: any) => {
                // Sort so ongoing elections come first, then upcoming
                if (a.status === 'ongoing' && b.status === 'upcoming') return -1;
                if (a.status === 'upcoming' && b.status === 'ongoing') return 1;
                return 0;
              })
              .map(async (election: any) => {
                // Fetch candidates for this election
                const candidatesResponse = await fetch(`http://127.0.0.1:5000/election/${election.election_id}/candidates`, {
                  method: 'GET',
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });

                let candidateCount = 0;
                let totalVotes = 0;
                if (candidatesResponse.ok) {
                  const candidates = await candidatesResponse.json();
                  candidateCount = candidates.length;
                  totalVotes = candidates.reduce((sum: number, candidate: any) => sum + (candidate.total_votes || 0), 0);
                }

                // Check if user has voted (only for ongoing elections)
                let hasVoted = false;
                if (election.status === 'ongoing' && user?.reg_no) {
                  hasVoted = await checkVoteStatus(user.reg_no, election.election_id);
                }

                return {
                  election_id: election.election_id,
                  position_name: election.position_name,
                  name: election.name,
                  start_time: election.start_time,
                  end_time: election.end_time,
                  status: election.status,
                  totalVotes,
                  candidateCount,
                  hasVoted,
                };
              })
          );
          
          setActiveElections(processedElections);
        } else {
          console.error('Failed to fetch elections:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching elections:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchElections();
    }
  }, [user]);

  // If user is not loaded yet, show loading state
  if (!user || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Calculate dynamic stats from real data
  const ongoingElections = activeElections.filter(e => e.status === 'ongoing');
  const votedElections = activeElections.filter(e => e.hasVoted);
  const pendingElections = activeElections.filter(e => e.status === 'ongoing' && !e.hasVoted);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors duration-200" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-400">Ongoing Elections</p>
                <p className="text-xl font-semibold text-white">{ongoingElections.length}</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors duration-200" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-400">My Clubs</p>
                <p className="text-xl font-semibold text-white">2</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors duration-200" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-400">Votes Cast</p>
                <p className="text-xl font-semibold text-white">{votedElections.length}</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors duration-200" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-400">Pending Votes</p>
                <p className="text-xl font-semibold text-white">{pendingElections.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Active Elections */}
          <div className="lg:col-span-2">
            <div className="border border-gray-800 rounded-lg" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-medium text-white">Active Elections</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {activeElections.length > 0 ? (
                    activeElections.map((election) => {
                      const now = new Date();
                      let deadline = '';
                      let deadlineLabel = '';
                      
                      if (election.status === 'upcoming') {
                        // For upcoming elections, show "starts in"
                        const startDate = new Date(election.start_time);
                        const timeDiff = startDate.getTime() - now.getTime();
                        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        
                        if (daysLeft > 0) {
                          deadline = daysLeft === 1 ? '1 day' : `${daysLeft} days`;
                          deadlineLabel = 'Starts in';
                        } else {
                          deadline = 'Starting soon';
                          deadlineLabel = '';
                        }
                      } else {
                        // For ongoing elections, show "ends in"
                        const endDate = new Date(election.end_time);
                        const timeDiff = endDate.getTime() - now.getTime();
                        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        
                        if (daysLeft > 0) {
                          deadline = daysLeft === 1 ? '1 day' : `${daysLeft} days`;
                          deadlineLabel = 'Ends in';
                        } else {
                          deadline = 'Ended';
                          deadlineLabel = '';
                        }
                      }

                      return (
                        <div key={election.election_id} className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors duration-200" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-base font-medium text-white">{election.position_name}</h3>
                            <div className="flex gap-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
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
                              {election.status === 'ongoing' && (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  election.hasVoted 
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}>
                                  {election.hasVoted ? 'Voted' : 'Pending'}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{election.name}</p>
                          <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                            <span>{election.totalVotes} votes cast</span>
                            <span>{election.candidateCount} candidates</span>
                            <span>{deadlineLabel} {deadline}</span>
                          </div>
                          <div className="flex gap-2">
                            {election.status === 'ongoing' && !election.hasVoted && (
                              <Link to="/voting" className="bg-white text-black px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200">
                                Vote Now
                              </Link>
                            )}
                            <Link to="/voting" className="border border-gray-600 text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors duration-200 cursor-pointer">
                              View Details
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No active elections at the moment</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Admin System Overview 
            <div className="border border-gray-800 rounded-lg mt-8" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-medium text-white">System Overview</h2>
                <p className="text-sm text-gray-400 mt-1">Admin dashboard</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 border border-gray-700 rounded-lg" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
                    <div className="text-xl font-semibold text-white">{systemStats.totalUsers}</div>
                    <div className="text-xs text-gray-400 mt-1">Total Users</div>
                  </div>
                  <div className="text-center p-3 border border-gray-700 rounded-lg" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
                    <div className="text-xl font-semibold text-white">{systemStats.totalClubs}</div>
                    <div className="text-xs text-gray-400 mt-1">Total Clubs</div>
                  </div>
                  <div className="text-center p-3 border border-gray-700 rounded-lg" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
                    <div className="text-xl font-semibold text-white">{systemStats.activeElections}</div>
                    <div className="text-xs text-gray-400 mt-1">Active Elections</div>
                  </div>
                  <div className="text-center p-3 border border-gray-700 rounded-lg" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
                    <div className="text-xl font-semibold text-white">{systemStats.completedElections}</div>
                    <div className="text-xs text-gray-400 mt-1">Completed</div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button className="bg-white text-black px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200">
                    Manage Users
                  </button>
                  <button className="border border-gray-600 text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors duration-200">
                    Manage Clubs
                  </button>
                  <button className="border border-gray-600 text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors duration-200">
                    System Settings
                  </button>
                </div>
              </div>
            </div> */}
          </div> 

          {/* Right Column */}
          <div className="space-y-6">
            {/* Club Head Management 
            <div className="border border-gray-800 rounded-lg" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-medium text-white">Club Management</h2>
                <p className="text-sm text-gray-400 mt-1">Club head actions</p>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <button className="w-full bg-white text-black py-2.5 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200">
                    Create Election
                  </button>
                  <button className="w-full border border-gray-600 text-gray-300 py-2.5 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors duration-200">
                    Manage Members
                  </button>
                  <button className="w-full border border-gray-600 text-gray-300 py-2.5 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors duration-200">
                    View Analytics
                  </button>
                  <button className="w-full border border-gray-600 text-gray-300 py-2.5 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors duration-200">
                    Club Settings
                  </button>
                </div>
              </div>
            </div> */}

            {/* Member Requests 
            <div className="border border-gray-800 rounded-lg" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-white">Member Requests</h2>
                  <span className="bg-red-500/20 text-red-300 text-xs font-medium px-2 py-1 rounded-full border border-red-500/30">
                    {memberRequests.length}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {memberRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors duration-200" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
                      <div>
                        <p className="font-medium text-white">{request.name}</p>
                        <p className="text-sm text-gray-400">{request.club}</p>
                        <p className="text-xs text-gray-500">{request.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-medium border border-green-500/30 hover:bg-green-500/30 transition-colors duration-200">
                          Accept
                        </button>
                        <button className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs font-medium border border-red-500/30 hover:bg-red-500/30 transition-colors duration-200">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}

            {/* Recent Results */}
            <div className="border border-gray-800 rounded-lg" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-medium text-white">Recent Results</h2>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <p className="text-gray-400">No recent results to display</p>
                  <p className="text-sm text-gray-500 mt-2">Completed elections will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;