"use client"
import React, { useContext, useState } from 'react'
import Link from "next/link";
import "./navbar_holder/navbar.css"
import { AuthContext } from '@/context/auth';


const Navbar = () => {
  const {isLoggedIn,setIsLoggedIn} = useContext(AuthContext);
  const globalData = useContext(AuthContext)

  return (
    <div>
    <div className='Navbar'>
        <h1>My App</h1>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/dashboard">Dashboard</Link>
      
      <button>
      <Link href="/auth/Login">Login</Link>
      </button>
    </div>
    </div>
  )
}

export default Navbar