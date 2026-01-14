export interface DatabaseStatus {
  isConnected: boolean;
  readyState: string;
  host?: string;
  port?: number;
  dbName?: string;
}
