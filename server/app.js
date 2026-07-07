import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import patientRoutes from './routes/patient.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import billRoutes from './routes/bill.routes.js';
import prescriptionRoutes from './routes/prescription.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hospital Management System API is running.'
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
