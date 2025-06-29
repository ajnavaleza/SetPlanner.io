const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

let isVotingEnabled = false;
let songs = new Map(); // Map to store songs with their IDs

function verifyDJToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.role === 'dj';
  } catch (error) {
    return false;
  }
}

function setupSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // In production, replace with your actual domain
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    let isDJ = false;

    // Send current system status to newly connected clients
    socket.emit('systemStatus', isVotingEnabled);
    
    // Send current song list to newly connected clients
    socket.emit('songList', Array.from(songs.values()));

    // Authenticate DJ
    socket.on('authenticate', (token) => {
      isDJ = verifyDJToken(token);
      socket.emit('authStatus', isDJ);
    });

    // Handle system status requests
    socket.on('getSystemStatus', () => {
      socket.emit('systemStatus', isVotingEnabled);
    });

    // Handle system status changes (DJ only)
    socket.on('setSystemStatus', (status, token) => {
      if (!verifyDJToken(token)) {
        socket.emit('error', 'Unauthorized: DJ access required');
        return;
      }
      isVotingEnabled = status;
      io.emit('systemStatus', isVotingEnabled);
    });

    // Handle song suggestions
    socket.on('suggestSong', ({ title, artist }) => {
      if (!isVotingEnabled) {
        socket.emit('error', 'Voting system is currently disabled');
        return;
      }

      // Check for duplicates
      const isDuplicate = Array.from(songs.values()).some(
        song => song.title.toLowerCase() === title.toLowerCase() && 
               song.artist.toLowerCase() === artist.toLowerCase()
      );

      if (isDuplicate) {
        socket.emit('error', 'This song has already been suggested');
        return;
      }

      const newSong = {
        id: uuidv4(),
        title,
        artist,
        votes: 0,
        addedBy: socket.id,
        voters: new Set() // Track who has voted for this song
      };

      songs.set(newSong.id, newSong);

      // Emit updated song list (without voters Set)
      io.emit('songList', Array.from(songs.values()).map(song => ({
        ...song,
        voters: undefined
      })));
    });

    // Handle voting
    socket.on('voteSong', (songId) => {
      if (!isVotingEnabled) {
        socket.emit('error', 'Voting system is currently disabled');
        return;
      }

      const song = songs.get(songId);
      if (!song) {
        socket.emit('error', 'Song not found');
        return;
      }

      if (song.voters.has(socket.id)) {
        socket.emit('error', 'You have already voted for this song');
        return;
      }

      song.votes += 1;
      song.voters.add(socket.id);

      // Emit updated song list (without voters Set)
      io.emit('songList', Array.from(songs.values()).map(song => ({
        ...song,
        voters: undefined
      })));
    });

    // Handle song removal (DJ only)
    socket.on('removeSong', (songId, token) => {
      if (!verifyDJToken(token)) {
        socket.emit('error', 'Unauthorized: DJ access required');
        return;
      }

      if (songs.has(songId)) {
        songs.delete(songId);
        io.emit('songList', Array.from(songs.values()).map(song => ({
          ...song,
          voters: undefined
        })));
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = setupSocketServer; 