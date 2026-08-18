import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

import { connectDB } from './config/db.js';

import movieRoutes from './routes/movieRoutes.js';
import showRoutes from './routes/showRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
  })
);

// JSON
app.use(express.json());

// Clerk authentication middleware
app.use(clerkMiddleware());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    name: 'VPCine API'
  });
});

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

// Server
const port = process.env.PORT || 5000;

connectDB().finally(() => {
  app.listen(port, () => {
    console.log(`VPCine API running on ${port}`);
  });
});