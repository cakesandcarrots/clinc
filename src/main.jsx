import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/authcontext' // Adjust the path if necessary
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import RegistrationForm from './components/Registrationform';
import PatientLogin from './components/Login';
import DoctorAppointment from './components/bookingcalender';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Services />
            </>
          } />
          <Route path="/signup" element={<RegistrationForm />} />
          <Route path="/login" element={<PatientLogin />} />
          <Route path="/booking-calendar" element={<DoctorAppointment />} />
        </Routes>
      </AuthProvider>
    </Router>
  </StrictMode>
);