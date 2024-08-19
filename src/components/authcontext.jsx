import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5001/check-session', { withCredentials: true });
        setLoggedIn(response.data.loggedIn);
        if (response.data.loggedIn) {
          setUserEmail(response.data.userEmail);
        }
      } catch (error) {
        console.error('Error checking session status', error);
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, userEmail, setUserEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);