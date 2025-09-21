import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [reg_no, displayRegNo] = useState("");
    const [password, displayPassword] = useState("");
    const [name, displayName] = useState("");
    const navigate = useNavigate();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ reg_no, password, name })
            });
            const data = await res.json();
            if (data.msg === "registered") {
                console.log("Registered successfully");
                navigate('/');
            } else {
                alert(data.msg);
            }
        } catch (err) {
            console.error("Error during registration:", err);
        }
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
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <input
                                type="password"
                                onChange={(e) => { displayPassword(e.target.value) }}
                                value={password}
                                placeholder="Create a secure password"
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Create Account
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