require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');

// Import routes
const apiRoutes = require('./api/routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join match room for live updates
  socket.on('join_match', (matchId) => {
    socket.join(`match_${matchId}`);
    console.log(`User ${socket.id} joined match ${matchId}`);
  });
  
  // Leave match room
  socket.on('leave_match', (matchId) => {
    socket.leave(`match_${matchId}`);
    console.log(`User ${socket.id} left match ${matchId}`);
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});

module.exports = { app, server, io };