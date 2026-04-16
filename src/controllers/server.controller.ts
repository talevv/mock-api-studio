import { Controller, Route } from "../types";

let isServerRunning = false;
const defaultPort = 4000;


export class ServerController implements Controller {
  routing: Route[] = [
    { method: 'post', path: '/server/run', handler: this.run },
    { method: 'post', path: '/server/stop', handler: this.stop }
  ]

  run(req: any, res: any) {
    // TODO add support for custom port in the future, for now we will use the default port
    const port = defaultPort;

    if (isServerRunning) {
      res.status(400).send('Server is already running');
      return;
    }

    isServerRunning = true;

    // Here you would add logic to start the server on the specified port
    // For example, you might call a function like startServer(port)

    res.render('server-running', {
      layout: false
    });
  }

  stop(req: any, res: any) {
    if (!isServerRunning) {
      res.status(400).send('Server is not running');
      return;
    }

    isServerRunning = false;

    // Here you would add logic to stop the server
    // For example, you might call a function like stopServer()

    res.render('server-stopped', {
      layout: false
    });
  }
}