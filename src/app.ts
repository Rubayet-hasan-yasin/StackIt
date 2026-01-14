import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import config from './config';
import { connectDatabase } from './database';
import routes from './routes';

function initializeMiddlewares(app: Application): void {
  // CORS
  app.use(cors());

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
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
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      status: 'ERROR',
      message: 'Route not found',
      path: req.path,
    });
  });
}

function initializeErrorHandling(app: Application): void {
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
      status: 'ERROR',
      message: config.nodeEnv === 'development' ? err.message : 'Internal server error',
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    });
  });
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
    const app = createApp();
    
    // Connect to database
    await connectDatabase();

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

// Initialize database connection for serverless
connectDatabase().catch((error) => {
  console.error('Database connection failed:', error);
});
