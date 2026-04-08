import { EndpointModel } from "../models/endpoint.model";
import { Controller, Route } from "../types";

export class EndpointController implements Controller {
  routing: Route[] = [
    { method: 'get', path: '/endpoints', handler: this.index },
    { method: 'get', path: '/endpoints/:id', handler: this.show },
  ]

  index(req: any, res: any) {
    const endpoints = EndpointModel.getAll();
    res.send(endpoints);
  }

  show(req: any, res: any) {
    const { id } = req.params;
    const endpoint = EndpointModel.getById(id);
    if (!endpoint) {
      res.status(404).send('Endpoint not found');
      return;
    }
    res.send(endpoint);
  }
}