import { getConnectionStatus } from '../../database';
import config from '../../config';
import { formatUptime, formatBytes } from '../../shared/utils';
import { API_STATUS } from '../../shared/constants';
import type { HealthCheckResponse, DetailedHealthCheckResponse } from '../../shared/types';

export class HealthService {
  async getSimpleHealth(): Promise<HealthCheckResponse> {
    return {
      status: API_STATUS.OK,
      message: 'Service is healthy',
      timestamp: new Date().toISOString(),
    };
  }

  async getDetailedHealth(): Promise<DetailedHealthCheckResponse> {
    const dbStatus = getConnectionStatus();
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    return {
      status: dbStatus.isConnected ? API_STATUS.OK : API_STATUS.DEGRADED,
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
        rss: formatBytes(memoryUsage.rss),
        heapTotal: formatBytes(memoryUsage.heapTotal),
        heapUsed: formatBytes(memoryUsage.heapUsed),
        external: formatBytes(memoryUsage.external),
      },
    };
  }
}

export const healthService = new HealthService();
