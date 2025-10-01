// Election Management API Service

const API_BASE_URL = 'http://127.0.0.1:5000';

export interface Club {
  club_id: number;
  name: string;
  description: string;
  logo_url: string;
  head_id: string;
}

export interface Position {
  position_id: number;
  position_name: string;
}

export interface Election {
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

export interface CreateElectionRequest {
  reg_no: string;
  club_id: number;
  position_id: number;
  start_time: string;
  end_time: string;
}

export interface UpdateElectionStatusRequest {
  status: string;
  reg_no: string;
  club_id: number;
}

export interface DeleteElectionRequest {
  reg_no: string;
  club_id: number;
}

// Fetch all elections
export const fetchAllElections = async (): Promise<{ success: boolean; data: Election[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/election/all`, {
      credentials: 'include',
    });

    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok ? data : [],
    };
  } catch (error) {
    console.error('Error fetching elections:', error);
    return {
      success: false,
      data: [],
    };
  }
};

// Fetch elections by status
export const fetchElectionsByStatus = async (status: string): Promise<{ success: boolean; data: Election[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/election/status/${status}`, {
      credentials: 'include',
    });

    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok ? data : [],
    };
  } catch (error) {
    console.error('Error fetching elections by status:', error);
    return {
      success: false,
      data: [],
    };
  }
};

// Fetch elections for a specific club
export const fetchClubElections = async (clubId: number): Promise<{ success: boolean; data: Election[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/election/club/${clubId}`, {
      credentials: 'include',
    });

    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok ? data : [],
    };
  } catch (error) {
    console.error('Error fetching club elections:', error);
    return {
      success: false,
      data: [],
    };
  }
};

// Create a new election
export const createElection = async (electionData: CreateElectionRequest): Promise<{ success: boolean; data: any }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/election/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(electionData),
    });

    const data = await response.json();

    return {
      success: response.ok,
      data,
    };
  } catch (error) {
    console.error('Error creating election:', error);
    return {
      success: false,
      data: { error: 'Network error occurred while creating election' },
    };
  }
};

// Update election status
export const updateElectionStatus = async (
  electionId: number,
  statusData: UpdateElectionStatusRequest
): Promise<{ success: boolean; data: any }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/election/${electionId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(statusData),
    });

    const data = await response.json();

    return {
      success: response.ok,
      data,
    };
  } catch (error) {
    console.error('Error updating election status:', error);
    return {
      success: false,
      data: { error: 'Network error occurred while updating election status' },
    };
  }
};

// Delete an election
export const deleteElection = async (
  electionId: number,
  deleteData: DeleteElectionRequest
): Promise<{ success: boolean; data: any }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/election/${electionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(deleteData),
    });

    const data = await response.json();

    return {
      success: response.ok,
      data,
    };
  } catch (error) {
    console.error('Error deleting election:', error);
    return {
      success: false,
      data: { error: 'Network error occurred while deleting election' },
    };
  }
};

// Fetch all clubs
export const fetchAllClubs = async (): Promise<{ success: boolean; data: Club[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/club/all`, {
      credentials: 'include',
    });

    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok ? data : [],
    };
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return {
      success: false,
      data: [],
    };
  }
};

// Fetch all positions
export const fetchAllPositions = async (): Promise<{ success: boolean; data: Position[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/position/all`, {
      credentials: 'include',
    });

    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok ? data : [],
    };
  } catch (error) {
    console.error('Error fetching positions:', error);
    // Fallback to hardcoded positions if API fails
    return {
      success: true,
      data: [
        { position_id: 1, position_name: 'President' },
        { position_id: 2, position_name: 'Vice President' },
        { position_id: 3, position_name: 'Secretary' },
        { position_id: 4, position_name: 'Treasurer' },
        { position_id: 5, position_name: 'Event Coordinator' },
        { position_id: 6, position_name: 'Technical Head' }
      ],
    };
  }
};

// Fetch user's clubs (for club heads)
export const fetchUserClubs = async (regNo: string): Promise<{ success: boolean; data: Club[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${regNo}/clubs`, {
      credentials: 'include',
    });

    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok ? data : [],
    };
  } catch (error) {
    console.error('Error fetching user clubs:', error);
    return {
      success: false,
      data: [],
    };
  }
};

// Fetch election details
export const fetchElectionDetails = async (electionId: number): Promise<{ success: boolean; data: Election | null }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/election/${electionId}`, {
      credentials: 'include',
    });

    const data = await response.json();

    return {
      success: response.ok,
      data: response.ok ? data : null,
    };
  } catch (error) {
    console.error('Error fetching election details:', error);
    return {
      success: false,
      data: null,
    };
  }
};