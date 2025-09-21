import { useState } from 'react';

const Clubs = () => {
  const [activeTab, setActiveTab] = useState('myClubs');
  
  // Mock user data - will be replaced with actual user context later
  // const user = {
  //   clubs: ["Tech Club", "Cultural Committee"],
  //   role: "member" // Can be "member", "head", or "admin"
  // };

  // Mock available clubs data
  const allClubs = [
    {
      id: 1,
      name: "Tech Club",
      description: "Explore the latest in technology and innovation",
      members: 156,
      category: "Technology",
      isJoined: true
    },
    {
      id: 2,
      name: "Cultural Committee",
      description: "Organize cultural events and celebrations",
      members: 89,
      category: "Culture",
      isJoined: true
    },
    {
      id: 3,
      name: "Sports Club",
      description: "Promoting physical fitness and sportsmanship",
      members: 203,
      category: "Sports",
      isJoined: false
    },
    {
      id: 4,
      name: "Literary Society",
      description: "For book lovers and aspiring writers",
      members: 67,
      category: "Literature",
      isJoined: false
    },
    {
      id: 5,
      name: "Environmental Club",
      description: "Working towards a greener future",
      members: 134,
      category: "Environment",
      isJoined: false
    },
    {
      id: 6,
      name: "Photography Club",
      description: "Capture life through the lens",
      members: 78,
      category: "Arts",
      isJoined: false
    }
  ];

  const categories = ["All", "Technology", "Culture", "Sports", "Literature", "Environment", "Arts"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredClubs = selectedCategory === "All" 
    ? allClubs 
    : allClubs.filter(club => club.category === selectedCategory);

  const myClubs = allClubs.filter(club => club.isJoined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Campus Clubs
          </h1>
          <p className="text-slate-400 text-lg">
            Discover, join, and manage your club memberships
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('myClubs')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'myClubs'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              My Clubs
            </button>
            <button
              onClick={() => setActiveTab('allClubs')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'allClubs'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              All Clubs
            </button>
          </div>
        </div>

        {/* My Clubs Tab */}
        {activeTab === 'myClubs' && (
          <div className="space-y-8">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-lg mr-4 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{myClubs.length}</p>
                    <p className="text-sm font-medium text-slate-300">Joined Clubs</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-lg mr-4 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">3</p>
                    <p className="text-sm font-medium text-slate-300">Active Events</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-lg mr-4 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">7</p>
                    <p className="text-sm font-medium text-slate-300">Leadership Roles</p>
                  </div>
                </div>
              </div>
            </div>

            {/* My Clubs List */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
              <div className="px-6 py-4 border-b border-white/20">
                <h2 className="text-xl font-semibold text-white">My Clubs</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {myClubs.map((club, index) => (
                    <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-3 rounded-lg mr-4 shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{club.name}</h3>
                            <p className="text-sm text-slate-400">{club.description}</p>
                            <p className="text-xs text-slate-500 mt-1">{club.members} members • {club.category}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300">
                            View
                          </button>
                          <button className="bg-white/10 border border-white/20 text-slate-300 hover:text-white hover:bg-white/20 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300">
                            Leave
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {myClubs.length === 0 && (
                  <div className="text-center py-8">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-slate-400 mb-4">You haven't joined any clubs yet</p>
                    <button 
                      onClick={() => setActiveTab('allClubs')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
                    >
                      Explore Clubs
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* All Clubs Tab */}
        {activeTab === 'allClubs' && (
          <div className="space-y-6">
            
            {/* Category Filter */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-white/10 text-slate-300 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Clubs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club) => (
                <div key={club.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-3 rounded-lg mr-4 shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <span className="inline-block bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                        {club.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">{club.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{club.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-300 text-sm">{club.members} members</span>
                      {club.isJoined && (
                        <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                          Joined
                        </span>
                      )}
                    </div>
                    
                    <button
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        club.isJoined
                          ? 'bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20 hover:text-white'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      }`}
                    >
                      {club.isJoined ? 'View Club' : 'Join Club'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;