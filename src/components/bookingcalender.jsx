import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from './authcontext';

const DoctorAppointment = () => {
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [existingAppointment, setExistingAppointment] = useState(null);
  const { userEmail } = useAuth();

  const timeSlots = ['10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM'];

  useEffect(() => {
    fetchBookedSlots(date);
    checkExistingAppointment();
  }, [date]);

  const fetchBookedSlots = async (selectedDate) => {
    try {
      const response = await axios.get('http://localhost:5001/booked-slots', {
        params: { date: selectedDate.toISOString() }
      });
      setBookedSlots(response.data.map(slot => slot.timeSlot));
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  };

  const checkExistingAppointment = async () => {
    try {
      const response = await axios.get('http://localhost:5001/patient-appointment', {
        params: { email: userEmail }
      });
      setHasAppointment(response.data.hasAppointment);
      setExistingAppointment(response.data.appointment);
    } catch (error) {
      console.error('Error checking existing appointment:', error);
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setTimeSlot('');
    setConfirmationMessage('');
    fetchBookedSlots(newDate);
  };

  const handleTimeSlotChange = (slot) => {
    setTimeSlot(slot);
    setConfirmationMessage('');
  };

  const handleBooking = async () => {
    try {
      const response = await axios.post('http://localhost:5001/book-appointment', {
        patientEmail: userEmail,
        date: date.toISOString(),
        timeSlot
      });
      setConfirmationMessage(response.data.message);
      fetchBookedSlots(date);
      setHasAppointment(true);
      checkExistingAppointment();
    } catch (error) {
      setConfirmationMessage(error.response?.data?.message || 'Error booking appointment');
    }
  };

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      return date < new Date();
    }
    return false;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toDateString();
      if (bookedSlots.includes(timeSlot)) {
        return 'fully-booked';
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Doctor Appointment
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Select a date and time for your appointment
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <Calendar 
            onChange={handleDateChange} 
            value={date} 
            className="w-full rounded-lg shadow-md"
            tileDisabled={tileDisabled}
            tileClassName={tileClassName}
            prevLabel={<span className="text-blue-500">&lt;</span>}
            nextLabel={<span className="text-blue-500">&gt;</span>}
          />
          <div className="grid grid-cols-2 gap-4 mt-4">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => handleTimeSlotChange(slot)}
                disabled={bookedSlots.includes(slot)}
                className={`px-4 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
                  timeSlot === slot
                    ? 'bg-indigo-600 text-white'
                    : bookedSlots.includes(slot)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
          <div>
            <button
              onClick={handleBooking}
              disabled={!date || !timeSlot}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Book Appointment
            </button>
          </div>
          {confirmationMessage && (
            <div className={`rounded-md ${confirmationMessage.includes('successfully') ? 'bg-green-50' : 'bg-yellow-50'} p-4`}>
              <p className="text-sm font-medium text-gray-800">{confirmationMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointment;
