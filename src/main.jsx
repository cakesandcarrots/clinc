import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './components/authcontext';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import RegistrationForm from './components/Registrationform';
import PatientLogin from './components/Login';
import DoctorAppointment from './components/bookingcalender';
import AdminPanel from './components/Doctordashboardsystem/AdminPanel';

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      {!isAdminRoute && <Navbar />}
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
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </AuthProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);