import bcrypt from 'bcryptjs';
import Patient from '../models/patient.js';
import Availability from '../models/availabilityModel.js';
// Registration Logic
export const registerPatient = async (req, res) => {
  try {
    const { name, email, password, gender, age } = req.body;
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new patient document
    const newPatient = new Patient({ name, email, password: hashedPassword, gender, age });

    // Save the document to the database
    await newPatient.save();

    res.status(201).send('Patient registered successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
};

// Login Logic
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the patient by email
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create a session
    req.session.patientId = patient._id;

    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).send('Server error');
  }
};

// In your patient controller or a new auth controller
export const checkSession = (req, res) => {
  if (req.session.patientId) {
    res.status(200).json({ loggedIn: true });
  } else {
    res.status(200).json({ loggedIn: false });
  }
};


export const logoutPatient = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.status(200).send('Logged out successfully');
  });
};


export const bookAppointment = async (req, res) => {
  try {
    const { patientEmail, date, timeSlot } = req.body;
    console.log(patientEmail);
    
    // Use `email` field from schema instead of `patientEmail`
    const patient = await Patient.findOne({ email: patientEmail });
    console.log(patient);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if the patient already has an appointment
    if (patient.appointments.length > 0) {
      return res.status(400).json({ message: 'You already have an appointment booked' });
    }

    // Check if the slot is available
    const existingAppointment = await Patient.findOne({
      'appointments.date': new Date(date),
      'appointments.timeSlot': timeSlot
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This slot is already booked' });
    }

    patient.appointments.push({ date, timeSlot });
    await patient.save();

    res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
};


export const getBookedSlots = async (req, res) => {
  try {
    const { date } = req.query;
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const bookedSlots = await Patient.aggregate([
      {
        $unwind: '$appointments'
      },
      {
        $match: {
          'appointments.date': {
            $gte: startDate,
            $lt: endDate
          }
        }
      },
      {
        $project: {
          date: '$appointments.date',
          timeSlot: '$appointments.timeSlot'
        }
      }
    ]);

    res.status(200).json(bookedSlots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booked slots', error: error.message });
  }
};

export const checkPatientAppointment = async (req, res) => {
  try {
    const { email } = req.query;
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const hasAppointment = patient.appointments.length > 0;
    const appointment = hasAppointment ? patient.appointments[0] : null;
    res.status(200).json({ hasAppointment, appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error checking appointment', error: error.message });
  }
};


export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select('-password');
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    console.log("Hi")
    const patient = await Patient.findById(req.params.id).select('-password');
    console.log(patient)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}, 'name email appointments');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePatientStatus = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update the patient’s status directly
    patient.status = status;
    await patient.save();

    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



export const getAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOne();
    // Format the dates before sending them to the frontend
    const formattedDates = availability ? 
      availability.availableDates.map(date => {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0];
      }) : [];
    
    res.json({ availableDates: formattedDates });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching availability', error: error.message });
  }
};

// Update Availability
export const updateAvailability = async (req, res) => {
  try {
    const { availableDates } = req.body;
    
    // Format the incoming dates to ensure consistency
    const formattedDates = availableDates.map(date => {
      const d = new Date(date);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().split('T')[0];
    });

    let availability = await Availability.findOne();

    if (availability) {
      availability.availableDates = formattedDates;
      await availability.save();
    } else {
      availability = new Availability({ availableDates: formattedDates });
      await availability.save();
    }

    res.json({ 
      message: 'Availability updated successfully', 
      availableDates: availability.availableDates.map(date => {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0];
      })
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating availability', error: error.message });
  }
};


export const getAvailableDays = async (req, res) => {
  try {
      // Find the availability document
      const availability = await Availability.findOne();
      
      if (!availability || !availability.availableDates) {
          return res.status(404).json({ message: 'No available dates found' });
      }

      // Simply map the dates to the expected format
      const availableDates = availability.availableDates.map(date => ({
          date: date
      }));
console.log(availability)
      res.status(200).json(availableDates);

  } catch (error) {
      console.error('Error fetching available days:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};