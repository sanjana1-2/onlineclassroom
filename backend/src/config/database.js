import mongoose from 'mongoose';
import { config } from './environment.js';
import logger from '../utils/logger.js';

export const connectDB = async () => {
  try {
    if (!config.mongodbUri) {
      logger.warn('MongoDB URI not configured - running in mock mode');
      return;
    }
    
    // Try to connect to MongoDB
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.warn('MongoDB connection failed - running in mock mode:', error.message);
    // Don't exit - run in mock mode
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('MongoDB disconnection error:', error);
  }
};
