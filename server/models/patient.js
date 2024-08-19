import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  appointments: [appointmentSchema],
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;