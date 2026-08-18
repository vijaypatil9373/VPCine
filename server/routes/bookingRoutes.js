import { Router } from 'express';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';

const r = Router();

// ========================================
// GET ALL BOOKINGS - Admin
// ========================================
r.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'show',
        populate: {
          path: 'movie'
        }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ========================================
// GET BOOKINGS OF ONE USER
// ========================================
r.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.params.userId
    })
      .populate({
        path: 'show',
        populate: {
          path: 'movie'
        }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ========================================
// CREATE BOOKING
// ========================================
r.post('/', async (req, res) => {
  const {
    userId,
    userName,
    showId,
    seats
  } = req.body;

  try {
    // Validate booking data
    if (
      !userId ||
      !showId ||
      !Array.isArray(seats) ||
      seats.length === 0
    ) {
      return res.status(400).json({
        message: 'Missing booking information'
      });
    }

    // Maximum 5 seats
    if (seats.length > 5) {
      return res.status(400).json({
        message: 'Maximum 5 seats can be booked'
      });
    }

    // Validate MongoDB Show ID
    if (!/^[0-9a-fA-F]{24}$/.test(showId)) {
      return res.status(400).json({
        message: 'Invalid show ID'
      });
    }

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({
        message: 'Show not found'
      });
    }

    // Check occupied seats
    for (const seat of seats) {
      if (show.occupiedSeats.get(seat)) {
        return res.status(409).json({
          message: `Seat ${seat} is already booked`
        });
      }
    }

    // Reserve seats
    for (const seat of seats) {
      show.occupiedSeats.set(seat, userId);
    }

    await show.save();

    // Create booking
    const booking = await Booking.create({
      userId,
      userName: userName || 'VPCine User',
      show: show._id,
      bookedSeats: seats,
      amount: seats.length * show.showPrice,
      isPaid: false
    });

    const populatedBooking =
      await Booking.findById(booking._id).populate({
        path: 'show',
        populate: {
          path: 'movie'
        }
      });

    res.status(201).json(populatedBooking);

  } catch (error) {
    console.error('Booking Error:', error);

    res.status(500).json({
      message: error.message
    });
  }
});

export default r;