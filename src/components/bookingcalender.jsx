import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from './authcontext';

const DoctorAppointment = () => {
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userEmail } = useAuth();

  const timeSlots = ['10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM']; // Doctor-set time slots

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        // Fetch available days
        const daysResponse = await axios.get('http://localhost:5001/availabledays');
        const days = daysResponse.data.map(day => new Date(day.date));
        setAvailableDays(days);

        if (days.length > 0) {
          const firstDay = days[0];
          setDate(firstDay);
          // Fetch booked slots for the first day
          const slotsResponse = await axios.get('http://localhost:5001/booked-slots', {
            params: { date: firstDay.toISOString().split('T')[0] }
          });
          const newBookedSlots = slotsResponse.data.map(slot => ({
            date: slot.date.split('T')[0],
            timeSlot: slot.timeSlot
          }));
          setBookedSlots(newBookedSlots);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const fetchBookedSlots = async (selectedDate) => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5001/booked-slots', {
        params: { date: selectedDate.toISOString().split('T')[0] }
      });
      const newBookedSlots = response.data.map(slot => ({
        date: slot.date.split('T')[0],
        timeSlot: slot.timeSlot
      }));
      setBookedSlots(newBookedSlots);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = async (newDate) => {
    setDate(newDate);
    setTimeSlot('');
    setConfirmationMessage('');
    await fetchBookedSlots(newDate);
  };

  const handleTimeSlotChange = (slot) => {
    setTimeSlot(slot);
    setConfirmationMessage('');
  };

  const handleBooking = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5001/book-appointment', {
        patientEmail: userEmail,
        date: date.toISOString(),
        timeSlot
      });
      setConfirmationMessage(response.data.message);
      await fetchBookedSlots(date);
    } catch (error) {
      setConfirmationMessage(error.response?.data?.message || 'Error booking appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const slotsForDay = bookedSlots.filter(slot => slot.date === dateString);
      return slotsForDay.length >= timeSlots.length || !availableDays.some(availableDate => 
        availableDate.toDateString() === date.toDateString()
      );
    }
    return false;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      if (bookedSlots.some(slot => slot.date === dateString)) {
        return 'partially-booked';
      }
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className=" flex flex-col justify-center items-center  max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          Doctor Appointment
        </h2>
        <Calendar 
          onChange={handleDateChange} 
          value={date} 
          tileDisabled={tileDisabled}
          tileClassName={tileClassName}
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => handleTimeSlotChange(slot)}
              disabled={
                !date || 
                bookedSlots.some(bookedSlot => 
                  bookedSlot.date === date.toISOString().split('T')[0] && bookedSlot.timeSlot === slot
                )
              }
              className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-200 ${
                timeSlot === slot
                  ? 'bg-indigo-600 text-white'
                  : bookedSlots.some(bookedSlot => 
                      bookedSlot.date === date.toISOString().split('T')[0] && bookedSlot.timeSlot === slot
                    )
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
        <button
          onClick={handleBooking}
          disabled={!date || !timeSlot || isLoading}
          className="w-full py-2 px-4 mt-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? 'Processing...' : 'Book Appointment'}
        </button>
        {confirmationMessage && (
          <div className={`mt-4 p-4 rounded-md ${
            confirmationMessage.includes('successfully') 
              ? 'bg-green-50 text-green-800' 
              : 'bg-red-50 text-red-800'
          }`}>
            <p>{confirmationMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;