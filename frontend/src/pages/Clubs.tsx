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
  name: string;        // Actual field name from database
  description: string;
  category?: string;
  created_at?: string;
  member_count?: number;
  logo_url?: string;
  head_id?: string;
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
        console.log('Sample club structure:', backendClubs[0]); // Debug log
        
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
            name: club.name || 'Unnamed Club',
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

  // Handler for joining a club
  const handleJoinClub = async (clubId: number) => {
    if (!user || !user.reg_no) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/club/${clubId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ reg_no: user.reg_no })
      });
      if (response.ok) {
        // Update UI: set membershipStatus to 'pending' for this club
        setAllClubs(prevClubs => prevClubs.map(club =>
          club.id === clubId ? { ...club, membershipStatus: 'pending' } : club
        ));
      } else {
        const errorData = await response.json();
        alert(errorData.msg || 'Failed to send join request');
      }
    } catch (err) {
      alert('Network error: could not send join request');
    }
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Campus Clubs
          </h1>
          <p className="text-gray-400 text-lg">
            Discover, join, and manage your club memberships
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="border border-gray-800 rounded-lg p-1 shadow-lg" style={{backgroundColor: 'hsla(0,0%,6.9%,1)'}}>
            <button
              onClick={() => setActiveTab('myClubs')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeTab === 'myClubs'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              My Clubs
            </button>
            <button
              onClick={() => setActiveTab('allClubs')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeTab === 'allClubs'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              All Clubs
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Loading clubs...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-red-500/30">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button 
              onClick={fetchClubs}
              className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-lg font-medium transition-all duration-300"
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
              <div className="border border-gray-800 rounded-lg p-6 shadow-lg" style={{backgroundColor: 'hsla(0,0%,6.9%,1)'}}>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{myClubs.length}</p>
                    <p className="text-sm font-medium text-gray-400">Joined Clubs</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-800 rounded-lg p-6 shadow-lg" style={{backgroundColor: 'hsla(0,0%,6.9%,1)'}}>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{pendingClubs.length}</p>
                    <p className="text-sm font-medium text-gray-400">Pending Requests</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-800 rounded-lg p-6 shadow-lg" style={{backgroundColor: 'hsla(0,0%,6.9%,1)'}}>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">7</p>
                    <p className="text-sm font-medium text-gray-400">Leadership Roles</p>
                  </div>
                </div>
              </div>
            </div>

            {/* My Clubs List */}
            <div className="border border-gray-800 rounded-lg shadow-lg" style={{backgroundColor: 'hsla(0,0%,6.9%,1)'}}>
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">My Clubs</h2>
                {/* Sub-tabs for My Clubs */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setMyClubsSubTab('joined')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                      myClubsSubTab === 'joined'
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600'
                    }`}
                  >
                    Joined Clubs ({myClubs.length})
                  </button>
                  <button
                    onClick={() => setMyClubsSubTab('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                      myClubsSubTab === 'pending'
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600'
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
                      <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mr-4">
                              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{club.name}</h3>
                              <p className="text-sm text-gray-400">{club.description}</p>
                              <p className="text-xs text-gray-500 mt-1">{club.members} members • {club.category}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                              View
                            </button>
                            <button className="bg-gray-700 border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                              Leave
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {myClubs.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <p className="text-gray-400 mb-4">You haven't joined any clubs yet</p>
                        <button 
                          onClick={() => setActiveTab('allClubs')}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
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
                      <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mr-4">
                              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{club.name}</h3>
                              <p className="text-sm text-gray-400">{club.description}</p>
                              <p className="text-xs text-gray-500 mt-1">{club.members} members • {club.category}</p>
                              <div className="flex items-center mt-2">
                                <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full text-xs font-medium border border-amber-500/30">
                                  ⏳ Pending Approval
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                              View
                            </button>
                            <button className="bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/30 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {pendingClubs.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 mb-4">No pending requests</p>
                        <button 
                          onClick={() => setActiveTab('allClubs')}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
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
            <div className="border border-gray-800 rounded-lg p-4 shadow-lg" style={{backgroundColor: 'hsla(0,0%,6.9%,1)'}}>
              <h3 className="text-lg font-semibold text-white mb-4">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600'
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
                <div key={club.id} className="border border-gray-800 rounded-lg shadow-lg hover:border-gray-700 transition-all duration-300" style={{backgroundColor: 'hsla(0,0%,6.9%,1)'}}>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <span className="inline-block bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs font-medium border border-purple-500/30">
                        {club.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">{club.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{club.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300 text-sm">{club.members} members</span>
                      {club.membershipStatus === 'approved' && (
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium border border-green-500/30">
                          Joined
                        </span>
                      )}
                      {club.membershipStatus === 'pending' && (
                        <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full text-xs font-medium border border-amber-500/30">
                          Pending
                        </span>
                      )}
                      {club.membershipStatus === 'rejected' && (
                        <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-medium border border-red-500/30">
                          Rejected
                        </span>
                      )}
                    </div>
                    
                    <button
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        club.membershipStatus === 'approved'
                          ? 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white'
                          : club.membershipStatus === 'pending'
                          ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400 cursor-not-allowed'
                          : club.membershipStatus === 'rejected'
                          ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                          : 'bg-purple-500 hover:bg-purple-600 text-white'
                      }`}
                      disabled={club.membershipStatus === 'pending'}
                      onClick={() => {
                        if (club.membershipStatus === undefined || club.membershipStatus === null) {
                          handleJoinClub(club.id);
                        }
                      }}
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