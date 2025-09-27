import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { state } = useAuth();
  const user = state.user;

  // If user is not loaded yet, show loading state
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const activeElections = [
    { id: 1, title: "Student Council Elections", club: "Student Body", deadline: "2 days", votes: 245, candidates: 5, hasVoted: false },
    { id: 2, title: "Tech Club Leadership", club: "Tech Club", deadline: "5 days", votes: 89, candidates: 3, hasVoted: true },
    { id: 3, title: "Cultural Committee Head", club: "Cultural Committee", deadline: "1 week", votes: 156, candidates: 4, hasVoted: false }
  ];

  const pastElections = [
    { id: 1, title: "Annual Sports Captain", club: "Sports Club", winner: "Alice Johnson", date: "2 weeks ago" },
    { id: 2, title: "Debate Society President", club: "Debate Society", winner: "Mike Chen", date: "1 month ago" }
  ];

  const systemStats = {
    totalUsers: 1247,
    totalClubs: 15,
    activeElections: 8,
    completedElections: 23
  };

  const memberRequests = [
    { id: 1, name: "Sarah Wilson", club: "Tech Club", date: "2 hours ago" },
    { id: 2, name: "David Brown", club: "Tech Club", date: "5 hours ago" },
    { id: 3, name: "Emma Davis", club: "Cultural Committee", date: "1 day ago" }
  ];

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
                <p className="text-xs font-medium text-gray-400">Active Elections</p>
                <p className="text-xl font-semibold text-white">{activeElections.length}</p>
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
                <p className="text-xl font-semibold text-white">{activeElections.filter(e => e.hasVoted).length}</p>
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
                <p className="text-xl font-semibold text-white">{activeElections.filter(e => !e.hasVoted).length}</p>
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
                  {activeElections.map((election) => (
                    <div key={election.id} className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors duration-200" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-base font-medium text-white">{election.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          election.hasVoted 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {election.hasVoted ? 'Voted' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{election.club}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                        <span>{election.votes} votes cast</span>
                        <span>{election.candidates} candidates</span>
                        <span>Ends in {election.deadline}</span>
                      </div>
                      <div className="flex gap-2">
                        {!election.hasVoted && (
                          <Link to="/voting" className="bg-white text-black px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200">
                            Vote Now
                          </Link>
                        )}
                        <button className="border border-gray-600 text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors duration-200">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
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

            {/* Past Elections */}
            <div className="border border-gray-800 rounded-lg" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-medium text-white">Recent Results</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {pastElections.map((election) => (
                    <div key={election.id} className="p-3 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors duration-200" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
                      <h4 className="font-medium text-white">{election.title}</h4>
                      <p className="text-sm text-gray-400">{election.club}</p>
                      <p className="text-sm text-green-400 font-medium">Winner: {election.winner}</p>
                      <p className="text-xs text-gray-500">{election.date}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 border border-gray-600 text-gray-300 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors duration-200">
                  View All Results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;