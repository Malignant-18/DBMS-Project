import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
    const [reg_no, displayRegNo] = useState("");
    const [password, displayPassword] = useState("");
    const [name, displayName] = useState("");
    const navigate = useNavigate();
    const { register, state, clearError } = useAuth();
    
    // Use context loading and error states
    const loading = state.isLoading;
    const error = state.error;
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation - form validation will handle empty fields
        if (!reg_no.trim() || !password.trim() || !name.trim()) {
            return;
        }
        
        // Validate register number format
        const regNoPattern = /^MDL[0-9]{2}[A-Z]{2}[0-9]{3}$/;
        if (!regNoPattern.test(reg_no.trim())) {
            return; // Form validation handles this
        }
        
        if (password.length < 6) {
            return; // Form validation handles this
        }
        
        // Clear any existing errors
        clearError();
        
        // Use the context register function
        const success = await register({ 
            reg_no: reg_no.trim(), 
            password, 
            name: name.trim() 
        });
        
        if (success) {
            console.log("Registration successful, navigating to landing");
            navigate('/');
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
                    <p className="text-gray-400">Join the Democratic Process</p>
                </div>

                {/* Register Form */}
                <div className="border border-gray-800 rounded-2xl p-8 shadow-xl" style={{backgroundColor: 'hsla(0,0%,6.9%,1)'}}>
                    <h2 className="text-2xl font-bold text-white text-center mb-6">Create Account</h2>
                    
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Register Number</label>
                            <input
                                type="text"
                                onChange={(e) => { displayRegNo(e.target.value) }}
                                value={reg_no}
                                placeholder="MDL22CS001 (Format: MDL[YY][XX][###])"
                                required
                                pattern="^MDL[0-9]{2}[A-Z]{2}[0-9]{3}$"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                                disabled={loading}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                onChange={(e) => { displayName(e.target.value) }}
                                value={name}
                                placeholder="Enter your full name"
                                required
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                                disabled={loading}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                onChange={(e) => { displayPassword(e.target.value) }}
                                value={password}
                                placeholder="Create a secure password (min 6 characters)"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
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
                                    Creating Account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Already have an account?{" "}
                            <Link 
                                to='/login' 
                                className="text-white hover:text-gray-300 font-medium transition-colors"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;