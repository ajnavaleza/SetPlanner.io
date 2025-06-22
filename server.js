const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import API handlers
const setPlanHandler = require('./api/set-plan.js').default;
const spotifyAuthHandler = require('./api/auth/spotify.js').default;
const spotifyCallbackHandler = require('./api/auth/spotify/callback.js').default;
const createPlaylistHandler = require('./api/spotify/create-playlist.js').default;

// API Routes
app.post('/api/set-plan', async (req, res) => {
  try {
    await setPlanHandler(req, res);
  } catch (error) {
    console.error('Error in set-plan handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/spotify', async (req, res) => {
  try {
    await spotifyAuthHandler(req, res);
  } catch (error) {
    console.error('Error in spotify auth handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/spotify/callback', async (req, res) => {
  try {
    await spotifyCallbackHandler(req, res);
  } catch (error) {
    console.error('Error in spotify callback handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/spotify/create-playlist', async (req, res) => {
  try {
    await createPlaylistHandler(req, res);
  } catch (error) {
    console.error('Error in create-playlist handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// For any other request, send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Development server running on http://localhost:${PORT}`);
}); 