import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState, LoginCredentials, RegisterData } from '../types/user';

// Action types for the reducer
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: User | null };

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: true, // Start with loading true to check for existing session
  error: null,
};

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isLoading: false, 
        error: null 
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.payload, 
        isLoading: false 
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isLoading: false, 
        error: null 
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null
      };
    default:
      return state;
  }
};

// Context interface
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkSession: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // API base URL
  const API_BASE = 'http://127.0.0.1:5000';

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check if user has an active session
  const checkSession = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('Checking session with backend...');
      
      // Try to get current user session
      const response = await fetch(`${API_BASE}/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Session check response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Session check response data:', data);
        
        // If we have user data in session, restore it
        if (data.user) {
          const user: User = {
            reg_no: data.user.reg_no,
            name: data.user.name,
            role: data.user.role,
            isAuthenticated: true,
          };
          console.log('Restoring user session from backend:', user);
          dispatch({ type: 'RESTORE_SESSION', payload: user });
          
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(user));
          dispatch({ type: 'SET_LOADING', payload: false });
          return; // Successfully restored from backend
        }
      }
      
      // If backend session failed, try localStorage as fallback
      console.log('Backend session failed, checking localStorage...');
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          console.log('Restoring user session from localStorage:', user);
          dispatch({ type: 'RESTORE_SESSION', payload: user });
          dispatch({ type: 'SET_LOADING', payload: false });
          return; // Successfully restored from localStorage
        } catch (parseError) {
          console.error('Error parsing stored user:', parseError);
          localStorage.removeItem('user');
        }
      }
      
      // No valid session found anywhere
      console.log('No valid session found');
      dispatch({ type: 'RESTORE_SESSION', payload: null });
      localStorage.removeItem('user');
      dispatch({ type: 'SET_LOADING', payload: false });
      
    } catch (error) {
      console.log('Session check error, falling back to localStorage:', error);
      
      // If network error, try localStorage as fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          console.log('Network error, restoring from localStorage:', user);
          dispatch({ type: 'RESTORE_SESSION', payload: user });
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        } catch (parseError) {
          console.error('Error parsing stored user:', parseError);
          localStorage.removeItem('user');
        }
      }
      
      dispatch({ type: 'RESTORE_SESSION', payload: null });
      localStorage.removeItem('user');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      console.log('Attempting login for:', credentials.reg_no);

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        console.log('Login successful, checking response for user data...');
        
        // Check if user data is included in login response
        if (data.user) {
          console.log('User data found in login response:', data.user);
          const user: User = {
            reg_no: data.user.reg_no,
            name: data.user.name,
            role: data.user.role || 'student',
            isAuthenticated: true,
          };

          console.log('Setting user from login response:', user);
          dispatch({ type: 'SET_USER', payload: user });
          localStorage.setItem('user', JSON.stringify(user));
          return true;
        }
        
        // Fallback: try /me endpoint if no user data in login response
        console.log('No user data in login response, trying /me endpoint...');
        
        // Add small delay to ensure session is set
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // After successful login, always get user data from /me endpoint
        try {
          console.log('Making /me request with cookies:', document.cookie);
          
          const meResponse = await fetch(`${API_BASE}/me`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log('Me endpoint response status:', meResponse.status);
          console.log('Me endpoint response headers:', meResponse.headers);

          if (meResponse.ok) {
            const meData = await meResponse.json();
            console.log('Me endpoint response data:', meData);
            console.log('User object:', meData.user);
            console.log('User name:', meData.user?.name);
            
            if (meData.user) {
              const user: User = {
                reg_no: meData.user.reg_no,
                name: meData.user.name,
                role: meData.user.role || 'student',
                isAuthenticated: true,
              };

              console.log('Setting user from /me endpoint:', user);
              dispatch({ type: 'SET_USER', payload: user });
              localStorage.setItem('user', JSON.stringify(user));
              return true;
            } else {
              console.error('No user data returned from /me endpoint. Response:', meData);
              dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch user data' });
              return false;
            }
          } else {
            const errorText = await meResponse.text();
            console.error('Failed to fetch user data from /me endpoint. Status:', meResponse.status, 'Response:', errorText);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch user data' });
            return false;
          }
        } catch (meError) {
          console.error('Error fetching user data from /me endpoint:', meError);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch user data' });
          return false;
        }
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.msg || 'Login failed' });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Network error. Please try again.' });
      return false;
    }
  };

  // Register function
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Registration successful, but don't auto-login
        dispatch({ type: 'SET_LOADING', payload: false });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: responseData.msg || 'Registration failed' });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Network error. Please try again.' });
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call backend logout endpoint if it exists
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.log('Logout API call failed:', error);
    } finally {
      // Clear local state regardless of API success
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('user');
    }
  };

  // Check for stored user on app load
  useEffect(() => {
    const checkStoredUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          // Always verify session with backend and fallback to localStorage
          console.log('Found stored user, checking session...');
          await checkSession();
        } else {
          console.log('No stored user found');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error checking stored user:', error);
        // Don't remove localStorage on app load errors - network might be down
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkStoredUser();
  }, []);

  const contextValue: AuthContextType = {
    state,
    login,
    register,
    logout,
    clearError,
    checkSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;