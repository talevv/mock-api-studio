import { Endpoint } from "../models/endpoint.model";
import { Controller, Route } from "../types";
import express from 'express';
import { Server } from "node:http";
import { logger } from "../logger";
import { ServerState, ServerStatus } from "../shared/server-state";

export class ServerController implements Controller {
  constructor(private readonly serverState: ServerState) {}

  private defaultPort = 4000;
  private serverInstance: Server | null = null;

  routing: Route[] = [
    { method: 'post', path: '/server/run', handler: this.run },
    { method: 'post', path: '/server/stop', handler: this.stop },
    { method: 'get', path: '/server', handler: this.index },
  ]

  index(req: any, res: any) {
    if (this.serverState.getStatus() !== ServerStatus.RUNNING || !this.serverInstance) {
      res.render('server-stopped', {
      layout: false
      });
    } else {
      res.render('server-running', {
        layout: false
      });
    }
  }

  run(req: any, res: any) {
    // TODO add support for custom port in the future, for now we will use the default port
    const port = this.defaultPort;

    if (this.serverState.getStatus() === ServerStatus.RUNNING) {
      logger.warn('Attempted to start server, but it is already running');
      res.status(400).send('Server is already running');
      return;
    }

    this.serverState.start();

    this.runServer(port);

    res.render('server-running', {
      layout: false
    });
  }

  stop(req: any, res: any) {
    if (this.serverState.getStatus() !== ServerStatus.RUNNING) {
      logger.warn('Attempted to stop server, but it is not running');
      res.status(400).send('Server is not running');
      return;
    }

    this.serverState.stop();

    this.stopServer();

    res.render('server-stopped', {
      layout: false
    });
  }

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
          const headers: Record<string, string> = (() => {
            try {
              return endpoint.headers ? JSON.parse(endpoint.headers) : {};
            } catch {
              return {};
            }
          })();
          Object.entries(headers).forEach(([name, value]) => {
            res.setHeader(name, value);
          });

          const hasContentType = Object.keys(headers)
            .some(k => k.toLowerCase() === 'content-type');

          // If the body looks like JSON and no Content-Type header is set, default to application/json
          if (!hasContentType && endpoint.body?.trim().startsWith('{')) {
            res.setHeader('Content-Type', 'application/json');
          }

          res.status(endpoint.status).send(endpoint.body);
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
}