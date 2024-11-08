import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  availableDates: [{ type: Date }],
});

export default mongoose.model('Availability', availabilitySchema);