export interface HealthCheckResponse {
  status: string;
  message: string;
  timestamp: string;
}

export interface DetailedHealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: {
    seconds: number;
    formatted: string;
  };
  database: {
    status: string;
    readyState: string;
    host?: string;
    port?: number;
    dbName?: string;
  };
  server: {
    nodeEnv: string;
    port: number;
    apiVersion: string;
    nodeVersion: string;
    platform: string;
  };
  memory: {
    rss: string;
    heapTotal: string;
    heapUsed: string;
    external: string;
  };
}
