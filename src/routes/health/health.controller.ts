import { Request, Response } from 'express';
import { getConnectionStatus } from '../../database';
import config from '../../config';

export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      status: 'OK',
      message: 'Service is healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: 'Service is unhealthy',
      timestamp: new Date().toISOString(),
    });
  }
};

export const healthCheckDetailed = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = getConnectionStatus();
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    const health = {
      status: dbStatus.isConnected ? 'OK' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(uptime),
        formatted: formatUptime(uptime),
      },
      database: {
        status: dbStatus.isConnected ? 'connected' : 'disconnected',
        readyState: dbStatus.readyState,
        host: dbStatus.host,
        port: dbStatus.port,
        dbName: dbStatus.dbName,
      },
      server: {
        nodeEnv: config.nodeEnv,
        port: config.port,
        apiVersion: config.api.version,
        nodeVersion: process.version,
        platform: process.platform,
      },
      memory: {
        rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
      },
    };

    const statusCode = dbStatus.isConnected ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: 'Unable to retrieve health information',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
};

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}
