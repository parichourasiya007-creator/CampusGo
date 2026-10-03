import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import transportRoutes from './routes/transport.js';
import etaRoutes from './routes/eta.js';
import initTrackingHandler from './socket/trackingHandler.js';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Optional MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('[MongoDB Atlas] Successfully connected to database.'))
    .catch((err) => console.error('[MongoDB Atlas] Connection error:', err.message));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/eta', etaRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    system: 'CampusGo DHSGSU Sagar Server',
    mongoStatus: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'STANDALONE',
    timestamp: new Date().toISOString(),
  });
});

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

initTrackingHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[CampusGo Server] Real-time tracking server running on port ${PORT}`);
});
