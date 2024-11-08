import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './authcontext';
import AppointmentHeader from './AppointmentHeader';
import ExistingAppointment from './ExistingAppointment';
import AppointmentCalendar from './AppointmentCalendar';
import TimeSlotSelector from './TimeSlotSelector';
import BookingButton from './BookingButton';
import ConfirmationMessage from './ConfirmationMessage';

const DoctorAppointment = () => {
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [existingAppointment, setExistingAppointment] = useState(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [availableDays, setAvailableDays] = useState([]);
  const { userEmail } = useAuth();

  useEffect(() => {
    const initializeData = async () => {
      await checkExistingAppointment();
      await fetchAvailableDays();
    };
    initializeData();
  }, []);

  useEffect(() => {
    if (date) {
      fetchBookedSlots(date);
    }
  }, [date]);

  const fetchAvailableDays = async () => {
    try {
      const response = await axios.get('http://localhost:5001/admin/availabledays');
      const days = response.data.map(day => new Date(day.date));
      setAvailableDays(days);
      if (days.length > 0) {
        setDate(days[0]);
      }
    } catch (error) {
      console.error('Error fetching available days:', error);
    }
  };

  const fetchBookedSlots = async (selectedDate) => {
    try {
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
      setConfirmedAppointment({ date, timeSlot });
      fetchBookedSlots(date);
      setHasAppointment(true);
      checkExistingAppointment();
    } catch (error) {
      setConfirmationMessage(error.response?.data?.message || 'Error booking appointment');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <AppointmentHeader hasAppointment={hasAppointment} />
        {hasAppointment && existingAppointment ? (
          <ExistingAppointment appointment={existingAppointment} />
        ) : (
          <div className="mt-8 space-y-6">
            {availableDays.length > 0 ? (
              <>
                <AppointmentCalendar 
                  date={date}
                  availableDays={availableDays}
                  bookedSlots={bookedSlots}
                  handleDateChange={handleDateChange}
                />
                <TimeSlotSelector
                  date={date}
                  timeSlot={timeSlot}
                  bookedSlots={bookedSlots}
                  handleTimeSlotChange={handleTimeSlotChange}
                />
                <BookingButton
                  date={date}
                  timeSlot={timeSlot}
                  handleBooking={handleBooking}
                />
                <ConfirmationMessage
                  confirmationMessage={confirmationMessage}
                  confirmedAppointment={confirmedAppointment}
                />
              </>
            ) : (
              <p className="text-center text-gray-600">No available days for appointments. Please check back later.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;