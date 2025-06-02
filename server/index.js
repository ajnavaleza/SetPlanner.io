import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import setPlannerRoute from './routes/setPlanner.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('.env file loaded successfully');
}

// Debug log for environment variables
console.log('Environment check:', {
  nodeEnv: process.env.NODE_ENV,
  hasSpotifyClientId: !!process.env.SPOTIFY_CLIENT_ID,
  hasSpotifyClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
  envPath: path.resolve(__dirname, '../.env')
});

const app = express();

// Enable CORS for all origins during development
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Root route for API health check
app.get('/', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Test route for Spotify credentials
app.get('/api/test-spotify', (req, res) => {
  const credentials = {
    clientIdLength: process.env.SPOTIFY_CLIENT_ID?.length || 0,
    clientSecretLength: process.env.SPOTIFY_CLIENT_SECRET?.length || 0,
    clientIdPrefix: process.env.SPOTIFY_CLIENT_ID?.substring(0, 4) || 'none',
    clientSecretPrefix: process.env.SPOTIFY_CLIENT_SECRET?.substring(0, 4) || 'none'
  };
  res.json(credentials);
});

// Routes
app.use('/api/set-plan', setPlannerRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
