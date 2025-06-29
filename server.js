require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const setupSocketServer = require('./server/socket');
const cors = require('cors');
const searchHandler = require('./api/spotify/search');

// Log environment variables (excluding sensitive data)
console.log('Environment variables loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  HAS_DJ_PASSWORD_HASH: !!process.env.DJ_PASSWORD_HASH,
  HAS_JWT_SECRET: !!process.env.JWT_SECRET,
  HAS_SPOTIFY_CREDENTIALS: !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET)
});

const app = express();
const server = http.createServer(app);

// Set up socket.io
setupSocketServer(server);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

<<<<<<< HEAD:server.js
// Middleware
app.use(cors());
app.use(express.json());

=======
>>>>>>> parent of 8ab2333 (health check):backend/server.js
// API routes
app.use('/api/auth/dj', require('./api/auth/dj/login'));
app.get('/api/spotify/search', searchHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 