import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import config from './config';
import { connectDatabase } from './database';
import routes from './routes';
import { requestLogger, errorHandler, notFoundHandler } from './shared/middleware';
import passport from './config/passport';
import { uploadService } from './modules/upload';

function initializeMiddlewares(app: Application): void {
  // CORS
  app.use(cors());

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (config.nodeEnv === 'development') {
    app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  }

  // Initialize Passport
  app.use(passport.initialize());

  // Request logging
  app.use(requestLogger);
}

function initializeRoutes(app: Application): void {
  // API routes
  app.use(`/api/${config.api.version}`, routes);

  // Root route
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      message: 'StackIt API',
      version: config.api.version,
      endpoints: {
        health: `/api/${config.api.version}/health`,
        healthDetailed: `/api/${config.api.version}/health/detailed`,
      },
    });
  });

  // 404 handler
  app.use(notFoundHandler);
}

function initializeErrorHandling(app: Application): void {
  app.use(errorHandler);
}

export function createApp(): Application {
  const app = express();
  
  initializeMiddlewares(app);
  initializeRoutes(app);
  initializeErrorHandling(app);
  
  return app;
}

export async function startServer(): Promise<void> {
  try {
    // Connect to database first
    await connectDatabase();
    
    const app = createApp();
    
    // Ensure upload directory exists (only in development)
    if (config.nodeEnv === 'development') {
      await uploadService.ensureUploadDir();
    }

    // Start server
    app.listen(config.port, () => {
      console.log(`
╔══════════════════════════════════════════╗
║     🚀 Server Started Successfully       ║
╠══════════════════════════════════════════╣
║  Environment: ${config.nodeEnv.padEnd(27)}║
║  Port:        ${config.port.toString().padEnd(27)}║
║  API Version: ${config.api.version.padEnd(27)}║
║  Database:    ${config.mongodb.dbName.padEnd(27)}║
╠══════════════════════════════════════════╣
║  📍 http://localhost:${config.port}                ║
╚══════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Export app instance for Vercel
export const app = createApp();

// Initialize database connection for serverless (eager connection)
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  connectDatabase().catch(console.error);
}
connectDatabase().catch((error) => {
  console.error('Database connection failed:', error);
});
