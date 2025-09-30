// Candidate service for fetching candidate-related data
const API_BASE_URL = 'http://127.0.0.1:5000';

export interface Candidate {
  candidate_id: number;
  election_id: number;
  reg_no: string;
  candidate_name: string;
  manifesto: string;
  total_votes: number;
}

export interface VoteRequest {
  reg_no: string;
  candidate_id: number;
}

export interface VoteResponse {
  msg?: string;
  error?: string;
}

/**
 * Fetch all candidates for a specific election
 * @param electionId - The election ID
 * @returns Promise with array of candidates
 */
export const fetchCandidatesForElection = async (electionId: number): Promise<Candidate[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/election/${electionId}/candidates`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const candidates: Candidate[] = await response.json();
      return candidates;
    } else {
      console.error(`Failed to fetch candidates for election ${electionId}:`, response.statusText);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching candidates for election ${electionId}:`, error);
    return [];
  }
};

/**
 * Submit a vote for a candidate in an election
 * @param electionId - The election ID
 * @param voteData - Vote request containing reg_no and candidate_id
 * @returns Promise with vote response
 */
export const submitVote = async (electionId: number, voteData: VoteRequest): Promise<{ success: boolean; data: VoteResponse }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/vote/cast/${electionId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(voteData),
    });

    const result: VoteResponse = await response.json();

    return {
      success: response.ok,
      data: result,
    };
  } catch (error) {
    console.error(`Error submitting vote for election ${electionId}:`, error);
    return {
      success: false,
      data: { error: 'Network error occurred while submitting vote' },
    };
  }
};

/**
 * Register as a candidate for an election
 * @param electionId - The election ID
 * @param candidateData - Candidate registration data
 * @returns Promise with registration response
 */
export const registerAsCandidate = async (
  electionId: number, 
  candidateData: { reg_no: string; manifesto: string }
): Promise<{ success: boolean; data: any }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/election/${electionId}/candidates`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(candidateData),
    });

    const result = await response.json();

    return {
      success: response.ok,
      data: result,
    };
  } catch (error) {
    console.error(`Error registering as candidate for election ${electionId}:`, error);
    return {
      success: false,
      data: { error: 'Network error occurred while registering as candidate' },
    };
  }
};

/**
 * Check if user has voted in a specific election
 * @param regNo - User registration number
 * @param electionId - The election ID
 * @returns Promise with vote status
 */
export const checkVoteStatus = async (regNo: string, electionId: number): Promise<boolean> => {
  try {
    const url = `${API_BASE_URL}/vote/check/${electionId}/${regNo}`;
    
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      return result.has_voted || false;
    } else {
      // If endpoint doesn't exist or fails, assume not voted
      return false;
    }
    
  } catch (error) {
    console.error(`Error checking vote status:`, error);
    // On error, assume not voted to allow user to try
    return false;
  }
};