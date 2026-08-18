import { Router } from 'express';
import Show from '../models/Show.js';

const router = Router();

// Get all shows
router.get('/', async (req, res) => {
  try {
    const shows = await Show.find()
      .populate('movie')
      .sort({ showDateTime: 1 });

    res.json(shows);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Get shows using TMDB movie ID
router.get('/movie/:tmdbId', async (req, res) => {
  try {
    const tmdbId = Number(req.params.tmdbId);

    const shows = await Show.find()
      .populate({
        path: 'movie',
        match: { tmdbId: tmdbId }
      })
      .sort({ showDateTime: 1 });

    // Remove shows whose movie didn't match tmdbId
    const filteredShows = shows.filter(show => show.movie);

    res.json(filteredShows);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Create show
router.post('/', async (req, res) => {
  try {
    const show = await Show.create(req.body);

    const populatedShow = await show.populate('movie');

    res.status(201).json(populatedShow);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

export default router;