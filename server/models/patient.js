// models/Patient.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  date: Date,
  timeSlot: String,
  link: String
});

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  status: {
    type: Number,
    default: 0,
    enum: [0, 1, 2] // 0: Unverified, 1: Approved, 2: Declined
  },
  appointments: [appointmentSchema]
});

export default mongoose.model('Patient', patientSchema);