import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/database.js';
import configureSession from './config/session.js';
import patientRoutes from './routes/patientroutes.js';

const app = express();
const port = 5001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // React app origin
  credentials: true
}));
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Configure Session
configureSession(app);

// Routes
app.use('/', patientRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
