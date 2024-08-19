// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './authcontext'
import axios from 'axios';  // Import axios here

const Navbar = () => {
  const { loggedIn, setLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5001/logout', {}, { withCredentials: true });
      setLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="text-3xl font-bold text-gray-900 tracking-wide">
            <Link to="/" className="hover:text-gray-700 transition-colors duration-300">
              Dentist
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {loggedIn ? (
              <button 
                onClick={handleLogout} 
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <button 
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
                <button 
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 p-2 rounded-full"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
