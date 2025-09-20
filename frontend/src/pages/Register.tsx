import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register=()=>{
    
    const[reg_no,displayRegNo]=useState("")
    const[password,displayPassword]=useState("")
    const[name,displayName]=useState("")
    const navigate=useNavigate()
    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
       try{
       const res=await fetch("http://127.0.0.1:5000/register",{method:"POST",headers:{"Content-Type":"application/json"},credentials: "include",body:JSON.stringify({reg_no,password,name})})
       const data=await res.json()
       if(data.msg==="registered")
       {
            console.log("Registered successfully");    
            navigate('/')
       }
       else
       {
            alert(data.msg)
       }
       }catch(err){
            console.error("Error during registration:", err);
        }

    }
    return(<div>
        <h1 className="text-white text-6xl  font-bold bg-blue-500 text-center">VOTING SYSTEM</h1>
                
                <form onSubmit={handleSubmit} className="flex flex-col  align-center text-center  p-5 m-auto mt-5  border border-amber-50 shadow-2xl w-fit h-70">
                    <h1 className="text-[20px] font-extrabold text-blue-500">Register</h1>
                    <input type="text" onChange={(e)=>{displayRegNo(e.target.value)}} value={reg_no} placeholder="enter register number"  required pattern="^MDL[0-9]{2}[A-Z]{2}[0-9]{3}$" className="w-50 border border-gray-400 p-1 m-auto "></input>
                    <input type="password" onChange={(e)=>{displayPassword(e.target.value)}} value={password} placeholder="enter password" required className="w-50 border border-gray-400 p-1 m-auto mt-0"></input>
                    <input type="text" onChange={(e)=>{displayName(e.target.value)}} value={name} placeholder="enter name" required className="w-50 border border-gray-400 p-1 m-auto mt-0"></input>
                    <button type="submit" className="bg-blue-400 text-amber-50 mb-2">Submit</button>
                    <p>Already have an account?<Link to='/' className="font-bold text-blue-500">Login</Link></p>
                </form>
    </div>)
}
export default Register