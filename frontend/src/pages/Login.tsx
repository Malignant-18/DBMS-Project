import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [reg_no, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/login", {method: "POST",headers: { "Content-Type": "application/json" },body: JSON.stringify({ reg_no, password }), credentials: "include"});
    const data = await res.json();
    if (res.ok) {
      navigate("/home");
    } 
    else {
      alert(data.msg);
    }
  };

  return (
    <div>
      <h1 className="text-white text-6xl font-bold bg-blue-500 text-center">VOTING SYSTEM</h1>
      <form onSubmit={handleLogin} className="flex flex-col p-5 m-auto mt-7 border  border-amber-50 shadow-2xl w-fit">
        <h1 className="text-blue-500 font-bold text-xl text-center mb-2">Login</h1>
        <input type="text" value={reg_no} onChange={(e) => setRegNo(e.target.value)} placeholder="Register No" className="border border-gray-500 p-1 m-auto" required/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border  border-gray-500 p-1 m-auto mt-2" required/>
        <button type="submit" className="bg-blue-400 text-white mt-3">Login</button>
        <p className="mt-2">Don't have an account? <Link to="/register" className="text-blue-500 font-bold">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;
