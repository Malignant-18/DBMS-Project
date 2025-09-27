// User service for fetching user-related data
const API_BASE_URL = 'http://localhost:5000';

export interface UserRole {
  role: string;
}

/**
 * Fetch user role from the backend using the existing role fetching module
 * @param reg_no - User registration number
 * @returns Promise with user role
 */
export const fetchUserRole = async (reg_no: string): Promise<string> => {
  try {
    // Since the backend has get_user_role() function available, 
    // we need a simple endpoint to access it. For now, we'll simulate the response
    // until the backend endpoint is properly configured to use the existing role module
    
    // TODO: Backend team should add this endpoint:
    // @auth_bp.route("/role/<reg_no>", methods=["GET"])
    // def get_user_role_endpoint(reg_no):
    //     from ..models.user_model import get_user_role
    //     role = get_user_role(reg_no)
    //     return jsonify({"role": role or "user"})
    
    const response = await fetch(`${API_BASE_URL}/auth/role/${reg_no}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.role || 'user';
    }

    // For now, return a default until the endpoint is added
    return 'user';
  } catch (error) {
    console.error('Error fetching user role - endpoint may not exist yet:', error);
    return 'user'; // Default role on error
  }
};

/**
 * Get display name for role
 * @param role - User role from database
 * @returns Formatted role name
 */
export const formatRole = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'Admin';
    case 'head':
      return 'Club Head';
    case 'user':
    default:
      return 'Student';
  }
};