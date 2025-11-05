import React, { useState } from "react";
import Logo from "../assets/images/logo.png";
import Title from "./Title";
import toast from "react-hot-toast"
import axios from "axios";
import {serverUrl} from "../../config";



const Login = ({setToken}) => {
  
  console.log(serverUrl)
  const [email, setEmail] = useState("")
  const [password, setPassword]=useState ("")
  const handleAdminLogin= async(e)=>{
     e.preventDefault();
    try {
      const response = await axios.post(serverUrl+ "/api/user/admin",{
          email, password
        })

      const data = response?.data;
      if(data?.success){
       setToken(data?.token);
         localStorage.setItem("adminToken", data?.token); 
       toast.success(data?.message)
      }else{
        toast.error(data?.message)
      }
      console.log(data)
    } catch (error) {
      console.log("Login Error", error?.message);
      toast.error(error?.message)
    }
  }
  return (
    <div className="flex flex-col gap-2 bg-gray-300 min-h-screen items-center justify-center ">
      <div className="bg-white p-2 rounded-md">
        <img src={Logo} alt="logo" className="h-10" />
      </div>
      <div className="bg-white p-5 min-w-96 shadow-2xl shadow-gray-800 rounded-lg">
        <Title className="text-xl font-bold">Admin Panel</Title>
        <form 
        onSubmit={handleAdminLogin}
        className="flex flex-col gap-4 mt-4">
          <div>
            <p className="text-sm font-semibold ">Email Address</p>
            <input
              type="text"
              placeholder="Enter Your Email"
              className="border w-full py-1 px-4 mt-1 rounded-md"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>
          <div>
            <p className="text-sm font-semibold ">Password</p>
            <input
              type="password"
              placeholder="Enter Your Password"
              className="border w-full py-1 px-4 mt-1 rounded-md"
              required
                  value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
          <button 
          type="submit "
          className="bg-black/80 text-white py-2 rounded-md hover:bg-black duration-300 transition-colors cursor-pointer">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
