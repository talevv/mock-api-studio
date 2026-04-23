import envPaths from "env-paths";
import path from "path";
import fs from "fs";
import { logger } from "../logger";

export const mapMethodToColor = (method: string): string => {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'bg-green-100 text-green-800';
    case 'POST':
      return 'bg-blue-100 text-blue-800';
    case 'PUT':
      return 'bg-yellow-100 text-yellow-800';
    case 'DELETE':
      return 'bg-red-100 text-red-800';
    case 'PATCH':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const dbFileName = "mock-api.db";

export const getDbPath = () => {
  const paths = envPaths('mock-api');

  if (!fs.existsSync(paths.data)) {
    fs.mkdirSync(paths.data, { recursive: true });
  }
  
  logger.info(`Using database path: ${paths.data}`);
  return path.join(paths.data, dbFileName);
};

export const findFreePort = (startPort: number = 3000, attempts: number = 10): Promise<number> => {
  const checkPort = (port: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const server = require('net').createServer();
      server.once('error', () => resolve(false));
      server.once('listening', () => {
        server.close(() => resolve(true));
      });
      server.listen(port);
    });
  };

  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < attempts; i++) {
      const port = startPort + i;
      if (await checkPort(port)) {
        resolve(port);
        return;
      }
    }
    reject(new Error(`No free port found in range ${startPort}-${startPort + attempts - 1}`));
  });
};