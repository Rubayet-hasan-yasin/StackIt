import mongoose from 'mongoose';
import config from '../config';
import type { DatabaseStatus } from '../shared/types';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log(`MongoDB connected successfully to ${config.mongodb.dbName}`);
    
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}

export function getConnectionStatus(): DatabaseStatus {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const readyState = mongoose.connection.readyState;
  
  return {
    isConnected: readyState === 1,
    readyState: states[readyState],
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    dbName: mongoose.connection.name,
  };
}
