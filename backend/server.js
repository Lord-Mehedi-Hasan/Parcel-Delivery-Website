import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

import authRoutes from './src/routes/authRoutes.js';
import parcelRoutes from './src/routes/parcelRoutes.js';
import driverRoutes from './src/routes/driverRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import branchRoutes from './src/routes/branchRoutes.js';
import calculatorRoutes from './src/routes/calculatorRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'FastParcel Express Logistics API',
    version: '1.0.0',
    time: new Date(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/reviews', reviewRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Parcel Delivery Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
