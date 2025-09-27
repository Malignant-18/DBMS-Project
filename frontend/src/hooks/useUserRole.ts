import { useState, useEffect } from 'react';
import { fetchUserRole, formatRole } from '../services/userService';

/**
 * Custom hook to fetch and manage user role
 * @param reg_no - User registration number
 * @returns Object containing role, loading state, and error
 */
export const useUserRole = (reg_no: string | null) => {
  const [role, setRole] = useState<string>('Student');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserRole = async () => {
      if (!reg_no) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const fetchedRole = await fetchUserRole(reg_no);
        const formattedRole = formatRole(fetchedRole);
        setRole(formattedRole);
      } catch (err) {
        setError('Failed to fetch user role');
        setRole('Student'); // Default fallback
      } finally {
        setIsLoading(false);
      }
    };

    getUserRole();
  }, [reg_no]);

  return { role, isLoading, error };
};