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
  HAS_JWT_SECRET: !!process.env.JWT_SECRET
});

const app = express();
const server = http.createServer(app);

// Set up socket.io with proper CORS configuration
const io = setupSocketServer(server);

// Configure CORS for Express
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL || 'https://set-planner-io.vercel.app'
    : 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Health check endpoint (place it before other routes)
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth/dj', require('./api/auth/dj/login'));
app.get('/api/spotify/search', searchHandler);

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check endpoint available at http://localhost:${PORT}/health`);
}); 