import Patient from '../models/patient.js';

export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Patient.aggregate([
      { $unwind: '$appointments' },
      {
        $project: {
          patientName: '$name',
          patientEmail: '$email',
          appointmentDate: '$appointments.date',
          timeSlot: '$appointments.timeSlot'
        }
      },
      { $sort: { appointmentDate: 1 } }
    ]);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

export const getDoctorPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}, { password: 0 });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients' });
  }
};