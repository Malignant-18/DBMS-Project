import { Link } from 'react-router-dom';

const Home = () => {
  // Mock data - will be replaced with actual API calls later
  const user = {
    name: "John Doe",
    role: "member", // Can be: "member", "club_head", "admin"
    clubs: ["Tech Club", "Cultural Committee"]
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Welcome Header */}
      <div className="bg-white/5 backdrop-blur-sm shadow-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome back, {user.name}!</h1>
              <p className="text-gray-300 mt-1">Here's what's happening in your organizations</p>
            </div>
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-6 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-3 rounded-lg shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Active Elections</p>
                <p className="text-2xl font-semibold text-white">{activeElections.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-6 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-3 rounded-lg shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">My Clubs</p>
                <p className="text-2xl font-semibold text-white">2</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-6 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-lg shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Votes Cast</p>
                <p className="text-2xl font-semibold text-white">{activeElections.filter(e => e.hasVoted).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-6 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-lg shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Pending Votes</p>
                <p className="text-2xl font-semibold text-white">{activeElections.filter(e => !e.hasVoted).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Active Elections */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
              <div className="px-6 py-4 border-b border-white/20">
                <h2 className="text-lg font-semibold text-white">Active Elections</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {activeElections.map((election) => (
                    <div key={election.id} className="border border-white/20 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white">{election.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          election.hasVoted 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                            : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                        }`}>
                          {election.hasVoted ? 'Voted' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{election.club}</p>
                      <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                        <span>🗳️ {election.votes} votes cast</span>
                        <span>👥 {election.candidates} candidates</span>
                        <span>⏰ Ends in {election.deadline}</span>
                      </div>
                      <div className="flex gap-2">
                        {!election.hasVoted && (
                          <Link to="/voting" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                            Vote Now
                          </Link>
                        )}
                        <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-white/20 hover:text-white transition-all duration-300">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin System Overview */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg mt-8">
              <div className="px-6 py-4 border-b border-white/20">
                <h2 className="text-lg font-semibold text-white">System Overview (Admin)</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{systemStats.totalUsers}</div>
                    <div className="text-sm text-gray-300">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{systemStats.totalClubs}</div>
                    <div className="text-sm text-gray-300">Total Clubs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{systemStats.activeElections}</div>
                    <div className="text-sm text-gray-300">Active Elections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-400">{systemStats.completedElections}</div>
                    <div className="text-sm text-gray-300">Completed</div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                    Manage Users
                  </button>
                  <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300">
                    Manage Clubs
                  </button>
                  <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-cyan-700 transition-all duration-300">
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Club Head Management */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
              <div className="px-6 py-4 border-b border-white/20">
                <h2 className="text-lg font-semibold text-white">Club Management (Head)</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-cyan-700 transition-all duration-300">
                    Create Election
                  </button>
                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-md text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300">
                    Manage Members
                  </button>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 rounded-md text-sm font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-300">
                    View Analytics
                  </button>
                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 rounded-md text-sm font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-300">
                    Club Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Member Requests */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
              <div className="px-6 py-4 border-b border-white/20">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-white">Member Requests</h2>
                  <span className="bg-gradient-to-r from-red-400 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
                    {memberRequests.length}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {memberRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border border-white/20 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                      <div>
                        <p className="font-medium text-white">{request.name}</p>
                        <p className="text-sm text-gray-300">{request.club}</p>
                        <p className="text-xs text-gray-400">{request.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded text-xs hover:from-green-600 hover:to-emerald-700 transition-all duration-300">
                          Accept
                        </button>
                        <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded text-xs hover:from-red-600 hover:to-pink-700 transition-all duration-300">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Past Elections */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
              <div className="px-6 py-4 border-b border-white/20">
                <h2 className="text-lg font-semibold text-white">Recent Results</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {pastElections.map((election) => (
                    <div key={election.id} className="p-3 border border-white/20 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                      <h4 className="font-medium text-white">{election.title}</h4>
                      <p className="text-sm text-gray-300">{election.club}</p>
                      <p className="text-sm text-green-400 font-medium">Winner: {election.winner}</p>
                      <p className="text-xs text-gray-400">{election.date}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 py-2 rounded-md text-sm font-medium hover:bg-white/20 hover:text-white transition-all duration-300">
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