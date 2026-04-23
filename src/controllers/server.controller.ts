import { Endpoint } from "../models/endpoint.model";
import { Controller, Route } from "../types";
import express from 'express';
import { Server } from "node:http";
import { logger } from "../logger";

export class ServerController implements Controller {
  private isServerRunning = false;
  private defaultPort = 4000;
  private serverInstance: Server | null = null;

  routing: Route[] = [
    { method: 'post', path: '/server/run', handler: this.run },
    { method: 'post', path: '/server/stop', handler: this.stop }
  ]

  private async runServer(port: number) {
    const app = express();
    const endpoints: Endpoint[] = await Endpoint.find({ where: { active: true }, order: { sortOrder: 'ASC' } });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const router = express.Router();

    endpoints.forEach(endpoint => {
      const method = endpoint.method.toLowerCase();
      if (['get', 'post', 'put', 'delete', 'patch', 'options'].includes(method)) {
        (router as any)[method](endpoint.path, (req: express.Request, res: express.Response) => {
          // TODO add support for dynamic response based on request body in the future, for now we will return the static response defined in the endpoint
          res.status(200).send(endpoint.body);
        });
      }
    });

    app.use(router);
    app.use((req: express.Request, res: express.Response) => {
      res.status(404).send('Endpoint not found');
    });

    this.serverInstance = app.listen(port, () => {
      logger.info(`Mock API server is running on port ${port}`);
    });
  }

  private stopServer() {
    if (this.serverInstance) {
      this.serverInstance.close(() => {
        logger.info('Mock API server has been stopped');
      });
      this.serverInstance = null;
    }
  }

  run(req: any, res: any) {
    // TODO add support for custom port in the future, for now we will use the default port
    const port = this.defaultPort;

    if (this.isServerRunning) {
      logger.warn('Attempted to start server, but it is already running');
      res.status(400).send('Server is already running');
      return;
    }

    this.isServerRunning = true;

    this.runServer(port);

    res.render('server-running', {
      layout: false
    });
  }

  stop(req: any, res: any) {
    if (!this.isServerRunning) {
      logger.warn('Attempted to stop server, but it is not running');
      res.status(400).send('Server is not running');
      return;
    }

    this.isServerRunning = false;

    this.stopServer();

    res.render('server-stopped', {
      layout: false
    });
  }
}