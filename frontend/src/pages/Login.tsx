import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [reg_no, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, state, clearError } = useAuth();
  
  // Use context loading and error states
  const loading = state.isLoading;
  const error = state.error;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation - we'll show this as an error through context
    if (!reg_no.trim() || !password.trim()) {
      return; // Form validation will handle this
    }
    
    // Clear any existing errors
    clearError();
    
    // Use the context login function
    const success = await login({ reg_no: reg_no.trim(), password });
    
    if (success) {
      console.log("Login successful, navigating to home");
      navigate("/home");
    }
    // Error handling is done by the context
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            EzyVote
          </h1>
          <p className="text-gray-400">Secure • Transparent • Democratic</p>
        </div>

        {/* Login Form */}
        <div className="border border-gray-800 rounded-2xl p-8 shadow-xl" style={{backgroundColor: 'hsla(0,0%,6.9%,1)'}}>
          <h2 className="text-2xl font-bold text-white text-center mb-6">Welcome Back</h2>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Register Number</label>
              <input
                type="text"
                value={reg_no}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="Enter your register number"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="text-white hover:text-gray-300 font-medium transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
