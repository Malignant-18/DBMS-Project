import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { state } = useAuth();

  // Show loading spinner while checking authentication
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to home page
  if (state.user && state.user.isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // If not authenticated, render the public component (login, register, landing)
  return <>{children}</>;
};

export default PublicRoute;