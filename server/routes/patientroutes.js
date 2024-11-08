import { Router } from 'express';
import { registerPatient, loginPatient,logoutPatient,checkSession,bookAppointment,getBookedSlots,checkPatientAppointment } from '../controllers/patientcontroller.js';
import { getDoctorAppointments} from '../controllers/doctorController.js';
import { getAllPatients, getPatientById ,getPatients,updatePatientStatus,getAvailability,updateAvailability,getAvailableDays} from '../controllers/patientcontroller.js';
const router = Router();

// Registration route
router.post('/register', registerPatient);//inuse
// Login route
router.post('/login', loginPatient);//inuse
router.get('/check-session', checkSession);//inuse
router.post('/logout', logoutPatient);//inuse
router.post('/book-appointment', bookAppointment);
router.get('/booked-slots', getBookedSlots);
router.get('/patient-appointment',checkPatientAppointment)
router.get('/doctor/appointments', getDoctorAppointments);
router.get('/patients/:id', getPatientById);//inuse
router.get('/patients', getAllPatients);
router.get('/', getPatients);
router.put('/patients/:patientId', updatePatientStatus);
router.get('/availability', getAvailability);
router.post('/availability', updateAvailability);
router.get('/availabledays', getAvailableDays);

export default router;
