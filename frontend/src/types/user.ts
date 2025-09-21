/**
 * User-related TypeScript interfaces for the voting system
 */

export interface User {
  reg_no: string;
  name: string;
  role?: string;
  isAuthenticated: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  reg_no: string;
  password: string;
}

export interface RegisterData {
  reg_no: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  msg: string;
  user?: {
    reg_no: string;
    name: string;
    role?: string;
  };
}