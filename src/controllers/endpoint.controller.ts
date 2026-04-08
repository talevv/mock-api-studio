import { EndpointModel } from "../models/endpoint.model";
import { Controller, Route } from "../types";
import { EndpointsListView } from "../views/endpoints-list.view";
import { Layout } from "../views/layout";

export class EndpointController implements Controller {
  routing: Route[] = [
    { method: 'get', path: '/endpoints', handler: this.index },
    { method: 'get', path: '/endpoints/:id', handler: this.show },
  ]

  index(req: any, res: any) {
    const endpoints = EndpointModel.getAll();
    const view = new EndpointsListView(endpoints);
    const layout = new Layout('Mock API Studio - Endpoints', view.render());
    res.send(layout.render());
  }

  show(req: any, res: any) {
    const { id } = req.params;
    const endpoint = EndpointModel.getById(id);
    if (!endpoint) {
      res.status(404).send('Endpoint not found');
      return;
    }
    const layout = new Layout('Mock API Studio - Endpoint', JSON.stringify(endpoint, null, 2));
    res.send(layout.render());
  }
}