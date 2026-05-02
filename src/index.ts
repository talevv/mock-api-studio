
import express from 'express';
import session from 'express-session';
import path from 'path';
import "reflect-metadata";
import open from "open";
import { engine } from 'express-handlebars';
import { EndpointController } from './controllers/endpoint.controller';
import { ServerController } from './controllers/server.controller';
import { registerEndpoints } from './routing';
import { logger } from './logger';
import { findFreePort } from './helpers/helpers';
import { AppDataSource } from './db/data-source';
import {ServerState} from "./shared/server-state";

interface StartServerOptions {
  port?: number;
  mockPort?: number;
  open?: boolean;
}

export const startServer = async (options?: StartServerOptions) => {
  const defaultPort = options?.port && parseInt(options.port.toString(), 10) || 3000;
  const mockPort = options?.mockPort && parseInt(options.mockPort.toString(), 10) || 4000;
  const app = express();
  app.use(session({
    // As a devtool, this is fine, but do not use hardcoded secrets in production!
    secret: process.env.SESSION_SECRET || 'development-secret',
    resave: false,
    saveUninitialized: false,
  }));

  const serverState = new ServerState();
  const endpointController = new EndpointController(serverState);
  const serverController = new ServerController(serverState, mockPort);
  
  app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: path.join(__dirname, '../views/partials'),
    helpers: {
      eq: (a: any, b: any) => a === b,
    },
  }));
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, '../views'));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, '../public')));
  
  registerEndpoints([endpointController, serverController], app);
  
  app.get('/', (req, res) => {
    res.redirect('/endpoints');
  });

  try {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    const port = await findFreePort(defaultPort);
    app.listen(port, () => {
      logger.info(`Server is running at http://localhost:${port}`);
    });
    
    if (options?.open) {
      await open(`http://localhost:${port}`);
    }
  } catch (err: any) {
    logger.error('Failed to find a free port:', err);
  }
};

