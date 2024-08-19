// src/components/Hero.jsx
import React from 'react';
import { useAuth } from './authcontext'; // Ensure the path is correct
import { useNavigate } from 'react-router-dom';
import docimage from '../assets/doc.png';

const Hero = () => {
  const { loggedIn } = useAuth(); // Access the authentication state
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleBookingClick = () => {
    navigate('/booking-calendar'); // Navigate to the BookingCalendar route
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="container mx-auto px-4 flex items-center">
        <div className="w-1/2 pr-16">
          <h1 className="text-6xl font-extralight text-gray-600 mb-3">Dr. Meghna Srivastava</h1>
          <p className="text-xl text-gray-500 mb-8">Dr. Meghna Srivastava's dental clinic welcomes you!</p>
          <div className="space-x-4">
            {loggedIn && (
              <button
                onClick={handleBookingClick} // Add onClick handler
                className="bg-blue-600 text-white text-sm font-semibold px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300"
              >
                BOOK VIRTUAL APPOINTMENT
              </button>
            )}
          </div>
        </div>
        <div>
          <img
            src={docimage}
            alt="Doctor"
            className="w-[50rem] h-[40rem]"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
