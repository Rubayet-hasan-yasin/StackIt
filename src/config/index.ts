import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongodb: {
    uri: string;
    dbName: string;
  };
  api: {
    version: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/stackit',
    dbName: process.env.DB_NAME || 'stackit',
  },
  api: {
    version: process.env.API_VERSION || 'v1',
  },
};

export default config;
