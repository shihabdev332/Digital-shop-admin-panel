import React, { useState } from 'react'
import Navbar from './component/Navbar'
import Sidebar from './component/Sidebar'
import {Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import Add from "./pages/Add"
import List from "./pages/List"
import Orders from "./pages/Orders"
import User from "./pages/User" 
import Login from './component/Login'


const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token"):""
  )
  return (
    <main className='w-full bg-gray-50 min-h-screen'>
   
   { token ==="" ? (
      <Login setToken={setToken}/>
    ):(
           
             <>
      <Navbar token= {token} setToken= {setToken}/>
      <div className='flex w-full'>
        <div className='w-[18%] fixed min-h-screen  border-r-1 border-gray-400 shadow-2xl'>
          <Sidebar/> 
        </div>
        <div className='flex-1 px-5 py-2 ml-[18%]'>
          <Routes>
            <Route path='/' element={<Home token= {token}/>}/>
            <Route path='/add' element={<Add token= {token}/>}/>
            <Route path='/list' element={<List token= {token}/>}/>
            <Route path='/order' element={<Orders token= {token}/>}/>
            <Route path='/user' element={<User token= {token}/>}/>
          </Routes>
        </div>
      </div>
      </>
    )
   }
    </main>
  )
}

export default App