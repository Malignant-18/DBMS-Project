import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Types
interface Club {
  club_id: number;
  name: string;
  description: string;
  logo_url: string;
  head_id: string;
}

interface Position {
  position_id: number;
  position_name: string;
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

interface ElectionFormData {
  club_id: string;
  position_id: string;
  start_time: string;
  end_time: string;
}

const ElectionManagement: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const user = state.user;

  // State management
  const [elections, setElections] = useState<Election[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [userClubs, setUserClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<ElectionFormData>({
    club_id: '',
    position_id: '',
    start_time: '',
    end_time: ''
  });
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'upcoming' | 'completed'>('all');

  // Check if user has permission to access this page
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Always fetch user's clubs to check if they're a club head
    // This will determine their permissions
    fetchUserClubs();
  }, [user, navigate]);

  // Fetch user's clubs (to determine permissions)
  const fetchUserClubs = async () => {
    if (!user) return;

    try {
      // Always check for headed clubs to determine if user is a club head
      const headedResponse = await fetch(`http://127.0.0.1:5000/user/${user.reg_no}/headed-clubs`, {
        credentials: 'include'
      });

      if (headedResponse.ok) {
        const headedClubs = await headedResponse.json();
        setUserClubs(headedClubs);
        
        // User permissions:
        // - Admin: Full access (create elections for any club)
        // - Club Head: Can create elections for clubs they head (headedClubs.length > 0)  
        // - Regular User: View only (headedClubs.length === 0)
        
        // No access denied error - all users can access the page
        // The UI will show different features based on their permissions
      }
    } catch (err) {
      console.error('Error fetching user clubs:', err);
      // Set empty array on error so regular users can still view
      setUserClubs([]);
    }
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchElections(),
          fetchClubs(),
          fetchPositions()
        ]);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Fetch elections based on user role
  const fetchElections = async () => {
    try {
      let url = 'http://127.0.0.1:5000/election/all';
      
      // If user is club head (not admin), fetch only their club elections
      if (user?.role !== 'admin' && userClubs.length > 0) {
        // For club heads, we'll filter elections after fetching all
        // This is a simplified approach; ideally we'd have a backend endpoint for this
      }

      const response = await fetch(url, { credentials: 'include' });
      
      if (response.ok) {
        const data = await response.json();
        
        // Sort elections by status priority: ongoing -> upcoming -> completed
        const sortElectionsByStatus = (elections: Election[]) => {
          const statusPriority = { 'ongoing': 1, 'upcoming': 2, 'completed': 3 };
          return elections.sort((a, b) => {
            const priorityA = statusPriority[a.status as keyof typeof statusPriority] || 4;
            const priorityB = statusPriority[b.status as keyof typeof statusPriority] || 4;
            return priorityA - priorityB;
          });
        };
        
        // Filter elections for club heads
        if (user?.role !== 'admin' && userClubs.length > 0) {
          const userClubIds = userClubs.map(club => club.club_id);
          const filteredElections = data.filter((election: Election) => 
            userClubIds.includes(election.club_id)
          );
          // Apply sorting to filtered results since backend sorting is applied to all data
          setElections(sortElectionsByStatus(filteredElections));
        } else {
          // Data is already sorted from backend service
          setElections(data);
        }
      }
    } catch (err) {
      console.error('Error fetching elections:', err);
    }
  };

  // Fetch all clubs
  const fetchClubs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/club/all', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setClubs(data);
      }
    } catch (err) {
      console.error('Error fetching clubs:', err);
    }
  };

  // Fetch all positions
  const fetchPositions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/position/all', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setPositions(data);
      } else {
        // Fallback: create positions data from what we know exists
        setPositions([
          { position_id: 1, position_name: 'President' },
          { position_id: 2, position_name: 'Vice President' },
          { position_id: 3, position_name: 'Secretary' },
          { position_id: 4, position_name: 'Treasurer' },
          { position_id: 5, position_name: 'Event Coordinator' },
          { position_id: 6, position_name: 'Technical Head' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching positions:', err);
      // Fallback positions
      setPositions([
        { position_id: 1, position_name: 'President' },
        { position_id: 2, position_name: 'Vice President' },
        { position_id: 3, position_name: 'Secretary' },
        { position_id: 4, position_name: 'Treasurer' },
        { position_id: 5, position_name: 'Event Coordinator' },
        { position_id: 6, position_name: 'Technical Head' }
      ]);
    }
  };

  // Handle form submission
  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const response = await fetch('http://127.0.0.1:5000/election/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          reg_no: user.reg_no,
          club_id: parseInt(formData.club_id),
          position_id: parseInt(formData.position_id),
          start_time: formData.start_time,
          end_time: formData.end_time
        })
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({ club_id: '', position_id: '', start_time: '', end_time: '' });
        await fetchElections(); // Refresh elections list
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create election');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  // Handle election status update
  const handleStatusUpdate = async (electionId: number, newStatus: string, clubId: number) => {
    if (!user) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/election/${electionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          status: newStatus,
          reg_no: user.reg_no,
          club_id: clubId
        })
      });

      if (response.ok) {
        await fetchElections(); // Refresh elections list
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update election status');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  // Handle election deletion
  const handleDeleteElection = async (electionId: number, clubId: number) => {
    if (!user || !window.confirm('Are you sure you want to delete this election?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/election/${electionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          reg_no: user.reg_no,
          club_id: clubId
        })
      });

      if (response.ok) {
        await fetchElections(); // Refresh elections list
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete election');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  // Filter elections based on active tab
  const filteredElections = elections.filter(election => {
    if (activeTab === 'all') return true;
    return election.status === activeTab;
  });

  // Get available clubs for form (admin sees all, club heads see only their clubs)
  const availableClubs = user?.role === 'admin' ? clubs : userClubs;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && error.includes('Access denied')) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/home')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {user?.role === 'admin' || userClubs.length > 0 ? 'Election Management' : 'Election Results'}
          </h1>
          <p className="text-gray-400">
            {user?.role === 'admin' ? 'Manage all elections across clubs' : 
             userClubs.length > 0 ? 'Manage elections for your clubs' :
             'View election results and statistics'}
          </p>
        </div>

        {/* Error Alert */}
        {error && !error.includes('Access denied') && (
          <div className="mb-6 bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Action Bar */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {(['all', 'ongoing', 'upcoming', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
{tab === 'completed' ? 'Completed' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ml-2 text-sm">
                  ({tab === 'all' ? elections.length : elections.filter(e => e.status === tab).length})
                </span>
              </button>
            ))}
          </div>

          {(user?.role === 'admin' || userClubs.length > 0) && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Election
            </button>
          )}
        </div>

        {/* Elections List */}
        <div className="grid gap-6">
          {filteredElections.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🗳️</div>
              <h3 className="text-xl font-medium text-gray-300 mb-2">No elections found</h3>
              <p className="text-gray-400">
                {activeTab === 'all' 
                  ? 'Create your first election to get started' 
                  : `No ${activeTab === 'completed' ? 'completed' : activeTab} elections at the moment`
                }
              </p>
            </div>
          ) : (
            filteredElections.map((election) => (
              <ElectionCard
                key={election.election_id}
                election={election}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDeleteElection}
                currentUser={user!}
                onViewResults={() => navigate(`/results/${election.election_id}`)}
              />
            ))
          )}
        </div>

        {/* Create Election Modal */}
        {showCreateForm && (
          <CreateElectionModal
            isOpen={showCreateForm}
            onClose={() => setShowCreateForm(false)}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateElection}
            clubs={availableClubs}
            positions={positions}
          />
        )}
      </div>
    </div>
  );
};

// Election Card Component
interface ElectionCardProps {
  election: Election;
  onStatusUpdate: (electionId: number, newStatus: string, clubId: number) => void;
  onDelete: (electionId: number, clubId: number) => void;
  currentUser: any;
  onViewResults: () => void;
}

const ElectionCard: React.FC<ElectionCardProps> = ({
  election,
  onStatusUpdate,
  onDelete,
  currentUser,
  onViewResults
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'upcoming': return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      case 'completed': return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const canManageElection = (election: Election) => {
    // Admin can manage all elections
    if (currentUser.role === 'admin') return true;
    
    // Club heads can manage elections they created or for clubs they head
    // Check if the user created this election OR if they're a head of the club
    return election.created_by === currentUser.reg_no;
  };

  return (
    <div className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors duration-200" style={{backgroundColor: 'hsla(0,0%,6.9%, 1)'}}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {election.position_name} - {election.name}
              </h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(election.status)}`}>
                {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <strong className="text-gray-300">Start:</strong> {formatDateTime(election.start_time)}
            </div>
            <div>
              <strong className="text-gray-300">End:</strong> {formatDateTime(election.end_time)}
            </div>
            <div>
              <strong className="text-gray-300">Created by:</strong> {election.created_by}
            </div>
            <div>
              <strong>Election ID:</strong> #{election.election_id}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onViewResults}
            className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm"
          >
            View Results
          </button>

          {canManageElection(election) && (
            <>
              {election.status !== 'completed' && (
                <select
                  onChange={(e) => onStatusUpdate(election.election_id, e.target.value, election.club_id)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue=""
                >
                  <option value="" disabled>Change Status</option>
                  {election.status !== 'ongoing' && <option value="ongoing">Start Election</option>}
                  <option value="completed">Complete Election</option>
                  {election.status !== 'upcoming' && <option value="upcoming">Reset to Upcoming</option>}
                </select>
              )}

              <button
                onClick={() => onDelete(election.election_id, election.club_id)}
                className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Create Election Modal Component
interface CreateElectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ElectionFormData;
  setFormData: (data: ElectionFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  clubs: Club[];
  positions: Position[];
}

const CreateElectionModal: React.FC<CreateElectionModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  clubs,
  positions
}) => {
  if (!isOpen) return null;

  // Get current date-time for min values
  const now = new Date();
  const minDateTime = now.toISOString().slice(0, 16);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Create New Election</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Club
              </label>
              <select
                value={formData.club_id}
                onChange={(e) => setFormData({ ...formData, club_id: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a club</option>
                {clubs.map((club) => (
                  <option key={club.club_id} value={club.club_id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Position
              </label>
              <select
                value={formData.position_id}
                onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a position</option>
                {positions.map((position) => (
                  <option key={position.position_id} value={position.position_id}>
                    {position.position_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                min={minDateTime}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                min={formData.start_time || minDateTime}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Election
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ElectionManagement;