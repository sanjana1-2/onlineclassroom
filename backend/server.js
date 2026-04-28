import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import { connectDB, disconnectDB } from './src/config/database.js';
import { config, validateConfig } from './src/config/environment.js';
import { setupSocketEvents } from './src/events/socketEvents.js';
import logger from './src/utils/logger.js';

// Validate environment variables
try {
  validateConfig();
} catch (error) {
  logger.error('Configuration error:', error.message);
  process.exit(1);
}

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Setup socket events
setupSocketEvents(io);

// Connect to database (optional)
await connectDB();

// Start server
const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

export { io };
