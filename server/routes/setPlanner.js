import express from 'express';
import { generateSetPlan } from '../services/spotifyService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    
    const { description, genre, length, referenceArtists } = req.body;
    
    // Validate required fields
    if (!genre || !length) {
      return res.status(400).json({ 
        error: "Missing required fields",
        required: ['genre', 'length'],
        received: req.body 
      });
    }

    const plan = await generateSetPlan(req.body);
    console.log('Generated plan successfully');
    res.json({ plan });
  } catch (err) {
    console.error('Error in set planner route:', err);
    res.status(500).json({ 
      error: err.message || "Failed to generate set plan",
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

export default router;
