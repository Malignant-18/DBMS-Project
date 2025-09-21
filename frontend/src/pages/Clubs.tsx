import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// TypeScript interface for Club data from backend
interface Club {
  id: number;
  name: string;
  description: string;
  members: number;
  category: string;
  isJoined: boolean;
  membershipStatus?: 'approved' | 'pending' | 'rejected' | null;
}

// Backend club data structure (what we receive from API)
interface BackendClub {
  club_id: number;
  club_name: string;
  description: string;
  category: string;
  created_at: string;
  member_count?: number;
}

// User membership data structure
interface UserMembership {
  membership_id: number;
  reg_no: string;
  club_id: number;
  role: string;
  status: 'approved' | 'pending' | 'rejected';
  joined_at: string;
}

const Clubs = () => {
  const { state } = useAuth();
  const user = state.user;
  
  const [activeTab, setActiveTab] = useState('myClubs');
  const [myClubsSubTab, setMyClubsSubTab] = useState('joined');
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch user memberships from backend
  const fetchUserMemberships = async (regNo: string): Promise<UserMembership[]> => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/user/${regNo}/memberships`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const memberships: UserMembership[] = await response.json();
        console.log('Fetched user memberships:', memberships);
        return memberships;
      } else {
        console.error('Failed to fetch user memberships');
        return [];
      }
    } catch (err) {
      console.error('Error fetching user memberships:', err);
      return [];
    }
  };
  
  // Fetch clubs data from the new backend endpoint
  const fetchClubs = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://127.0.0.1:5000/club/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const backendClubs: BackendClub[] = await response.json();
        console.log('Fetched clubs from backend:', backendClubs);
        
        // Fetch user memberships if user is logged in
        let userMemberships: UserMembership[] = [];
        if (user && user.reg_no) {
          userMemberships = await fetchUserMemberships(user.reg_no);
        }
        
        // Create a map of club_id to membership status for quick lookup
        const membershipMap = new Map<number, 'approved' | 'pending' | 'rejected'>();
        userMemberships.forEach(membership => {
          membershipMap.set(membership.club_id, membership.status);
        });
        
        // Transform backend data to frontend format
        const transformedClubs: Club[] = backendClubs.map((club: BackendClub) => {
          const membershipStatus = membershipMap.get(club.club_id) || null;
          return {
            id: club.club_id,
            name: club.club_name,
            description: club.description || 'No description available',
            members: club.member_count || Math.floor(Math.random() * 200) + 50, // Use backend count or fallback
            category: club.category || 'General',
            isJoined: membershipStatus === 'approved',
            membershipStatus: membershipStatus
          };
        });
        
        setAllClubs(transformedClubs);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setError(`Failed to fetch clubs: ${errorData.msg || 'Unknown error'}`);
        
        // Fallback to mock data for development
        setAllClubs(getMockClubs());
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Unable to connect to server - using demo data');
      
      // Fallback to mock data
      setAllClubs(getMockClubs());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  // Mock data fallback function
  const getMockClubs = (): Club[] => [
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
      name: "Environmental Club",
      description: "Working towards a greener future",
      members: 134,
      category: "Environment",
      isJoined: false
    },
    {
      id: 5,
      name: "Photography Club",
      description: "Capture life through the lens",
      members: 78,
      category: "Arts",
      isJoined: false
    }
  ];

  // Generate categories dynamically from clubs data
  const categories = ["All", ...Array.from(new Set(allClubs.map(club => club.category)))];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredClubs = selectedCategory === "All" 
    ? allClubs 
    : allClubs.filter(club => club.category === selectedCategory);

  const myClubs = allClubs.filter(club => club.isJoined);
  const pendingClubs = allClubs.filter(club => club.membershipStatus === 'pending');

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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-spin">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg">Loading clubs...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-red-400 to-pink-400 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button 
              onClick={fetchClubs}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Content - only show when not loading */}
        {!loading && (
          <>
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
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-lg mr-4 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{pendingClubs.length}</p>
                    <p className="text-sm font-medium text-slate-300">Pending Requests</p>
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
                <h2 className="text-xl font-semibold text-white mb-4">My Clubs</h2>
                {/* Sub-tabs for My Clubs */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setMyClubsSubTab('joined')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      myClubsSubTab === 'joined'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-white/10 text-slate-300 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    Joined Clubs ({myClubs.length})
                  </button>
                  <button
                    onClick={() => setMyClubsSubTab('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      myClubsSubTab === 'pending'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-white/10 text-slate-300 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    Pending Requests ({pendingClubs.length})
                  </button>
                </div>
              </div>
              <div className="p-6">
                {/* Joined Clubs Content */}
                {myClubsSubTab === 'joined' && (
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
                )}

                {/* Pending Requests Content */}
                {myClubsSubTab === 'pending' && (
                  <div className="space-y-4">
                    {pendingClubs.map((club, index) => (
                      <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-lg mr-4 shadow-lg">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{club.name}</h3>
                              <p className="text-sm text-slate-400">{club.description}</p>
                              <p className="text-xs text-slate-500 mt-1">{club.members} members • {club.category}</p>
                              <div className="flex items-center mt-2">
                                <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium border border-yellow-500/30">
                                  ⏳ Pending Approval
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300">
                              View
                            </button>
                            <button className="bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/30 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {pendingClubs.length === 0 && (
                      <div className="text-center py-8">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-slate-400 mb-4">No pending requests</p>
                        <button 
                          onClick={() => setActiveTab('allClubs')}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
                        >
                          Apply to Clubs
                        </button>
                      </div>
                    )}
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
                      {club.membershipStatus === 'approved' && (
                        <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                          Joined
                        </span>
                      )}
                      {club.membershipStatus === 'pending' && (
                        <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      )}
                      {club.membershipStatus === 'rejected' && (
                        <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                          Rejected
                        </span>
                      )}
                    </div>
                    
                    <button
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        club.membershipStatus === 'approved'
                          ? 'bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20 hover:text-white'
                          : club.membershipStatus === 'pending'
                          ? 'bg-yellow-600/20 border border-yellow-600/30 text-yellow-300 cursor-not-allowed'
                          : club.membershipStatus === 'rejected'
                          ? 'bg-red-600/20 border border-red-600/30 text-red-300 hover:bg-red-600/30'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      }`}
                      disabled={club.membershipStatus === 'pending'}
                    >
                      {club.membershipStatus === 'approved' ? 'View Club' : 
                       club.membershipStatus === 'pending' ? 'Request Pending' :
                       club.membershipStatus === 'rejected' ? 'Request Again' : 
                       'Join Club'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default Clubs;