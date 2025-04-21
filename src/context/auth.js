"use client"
import { isUserLoggedIn } from "@/helpers/auth";
import { useState, createContext, useEffect } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  useEffect(()=>{
    setisLoggedIn(isUserLoggedIn())
  },[])
  return (
    <AuthContext.Provider 
    value={{ isLoggedIn, setisLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
