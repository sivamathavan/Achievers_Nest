import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseJWT } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for token
    const token = localStorage.getItem('achievers_token');
    
    if (token) {
      const decodedUser = parseJWT(token);
      
      if (decodedUser) {
        // Check if token expired
        const isExpired = decodedUser.exp * 1000 < Date.now();
        if (isExpired) {
          logout();
        } else {
          setUser(decodedUser);
        }
      } else {
        logout();
      }
    }
    
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('achievers_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('achievers_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
