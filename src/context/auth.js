"use client"
import { isUserLoggedIn } from "@/helpers/auth";
import { useState, createContext, useEffect } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkLoginStatus = () => {
      const loggedIn = isUserLoggedIn();
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
    // Check login status when storage changes
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  // During server-side rendering, provide a default context value
  const contextValue = {
    isLoggedIn: mounted ? isLoggedIn : false,
    setIsLoggedIn: mounted ? setIsLoggedIn : () => {},
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
