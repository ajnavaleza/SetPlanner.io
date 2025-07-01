const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for fallback
const mockTracks = [
  {
    id: '1',
    name: 'Example Track 1',
    artist: 'Artist 1',
    duration: 3,
    popularity: 85,
    preview_url: 'https://example.com/preview1.mp3'
  },
  {
    id: '2',
    name: 'Example Track 2',
    artist: 'Artist 2',
    duration: 4,
    popularity: 75,
    preview_url: 'https://example.com/preview2.mp3'
  }
];

// Set Plan endpoint
app.post('/api/set-plan', async (req, res) => {
  try {
    const { description, genre, referenceArtists, length } = req.body;
    
    if (!genre) {
      return res.status(400).json({ error: 'Genre is required' });
    }

    // Return mock data for now
    return res.status(200).json({
      plan: {
        genre,
        description,
        total_duration: length,
        tracks: mockTracks,
        enhanced: false
      }
    });

  } catch (error) {
    console.error('Error generating set plan:', error);
    return res.status(500).json({ error: 'Failed to generate set plan' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 