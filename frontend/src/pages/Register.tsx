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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        EzyVote
                    </h1>
                    <p className="text-slate-400">Join the Democratic Process</p>
                </div>

                {/* Register Form */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-2xl font-bold text-white text-center mb-6">Create Account</h2>
                    
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                            <p className="text-red-300 text-sm text-center">{error}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Register Number</label>
                            <input
                                type="text"
                                onChange={(e) => { displayRegNo(e.target.value) }}
                                value={reg_no}
                                placeholder="MDL22CS001 (Format: MDL[YY][XX][###])"
                                required
                                pattern="^MDL[0-9]{2}[A-Z]{2}[0-9]{3}$"
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                disabled={loading}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                onChange={(e) => { displayName(e.target.value) }}
                                value={name}
                                placeholder="Enter your full name"
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                disabled={loading}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <input
                                type="password"
                                onChange={(e) => { displayPassword(e.target.value) }}
                                value={password}
                                placeholder="Create a secure password (min 6 characters)"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                disabled={loading}
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <p className="text-slate-400">
                            Already have an account?{" "}
                            <Link 
                                to='/login' 
                                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
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