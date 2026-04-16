import { db } from "../db/db-sqlite";
import { Controller, Route } from "../types";
import express from 'express';
import { Server } from "node:http";

interface Endpoint {
  id: string;
  name: string;
  path: string;
  method: string;
  body: string;
}

export class ServerController implements Controller {
  private isServerRunning = false;
  private defaultPort = 4000;
  private serverInstance: Server | null = null;

  routing: Route[] = [
    { method: 'post', path: '/server/run', handler: this.run },
    { method: 'post', path: '/server/stop', handler: this.stop }
  ]

  private runServer(port: number) {
    const app = express();
    const endpoints: Endpoint[] = db.prepare('SELECT name, path, method, body FROM endpoints WHERE active = 1 ORDER BY sort_order ASC').all() as Endpoint[];

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const endpoint = endpoints.find(e => e.path === req.path && e.method.toLowerCase() === req.method.toLowerCase());
      if (endpoint) {
        // TODO add support for dynamic response based on request body in the future, for now we will return the static response defined in the endpoint
        res.status(200).send(endpoint.body);
      } else {
        res.status(404).send('Endpoint not found');
      }
    });

    this.serverInstance = app.listen(port, () => {
      console.log(`Mock API server is running on port ${port}`);
    });
  }

  private stopServer() {
    if (this.serverInstance) {
      this.serverInstance.close(() => {
        console.log('Mock API server has been stopped');
      });
      this.serverInstance = null;
    }
  }

  run(req: any, res: any) {
    // TODO add support for custom port in the future, for now we will use the default port
    const port = this.defaultPort;

    if (this.isServerRunning) {
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