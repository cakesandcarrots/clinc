import { Router } from 'express';
import { registerPatient, loginPatient,logoutPatient,checkSession,bookAppointment,getBookedSlots,checkPatientAppointment } from '../controllers/patientcontroller.js';

const router = Router();

// Registration route
router.post('/register', registerPatient);
// Login route
router.post('/login', loginPatient);
router.get('/check-session', checkSession);
router.post('/logout', logoutPatient);
router.post('/book-appointment', bookAppointment);
router.get('/booked-slots', getBookedSlots);
router.get('/patient-appointment',checkPatientAppointment)
export default router;
