import { app, startServer } from './app';
import { disconnectDatabase } from './database';

// For local development
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer();
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await disconnectDatabase();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    await disconnectDatabase();
    process.exit(0);
  });
}

// Export for Vercel serverless
export default app;
