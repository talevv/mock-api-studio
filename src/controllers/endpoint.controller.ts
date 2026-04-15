import { EndpointModel } from "../models/endpoint.model";
import { Controller, Route } from "../types";
import { EndpointCreateView } from "../views/endpoint-create.view";
import { EndpointShowView } from "../views/endpoint-show.view";
import { EndpointUpdateView } from "../views/endpoint-update.view";
import { EndpointsListView } from "../views/endpoints-list.view";
import { Layout } from "../views/layout";

export class EndpointController implements Controller {
  routing: Route[] = [
    { method: 'get', path: '/endpoints', handler: this.index },
    { method: 'get', path: '/endpoints/create', handler: this.create },
    { method: 'post', path: '/endpoints/create', handler: this.store },
    { method: 'post', path: '/endpoints/activate', handler: this.activate },
    { method: 'get', path: '/endpoints/:id', handler: this.show },
    { method: 'post', path: '/endpoints/:id/delete', handler: this.delete },
    { method: 'get', path: '/endpoints/:id/edit', handler: this.edit },
    { method: 'post', path: '/endpoints/:id/update', handler: this.update}
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
    const view = new EndpointShowView(endpoint);
    const layout = new Layout('Mock API Studio - Endpoint', view.render());
    res.send(layout.render());
  }
  
  activate(req: any, res: any) {
    const { active } = req.body;
    const activatedEndpoints =  EndpointModel.activate(Array.isArray(active) ? active : [active]);
    const view = new EndpointsListView(activatedEndpoints, true);
    const layout = new Layout('Mock API Studio - Endpoints', view.render());
    res.send(layout.render());
  }

  create(req: any, res: any) {
    console.log('Rendering create endpoint form');
    const view = new EndpointCreateView();
    const layout = new Layout('Mock API Studio - Create Endpoint', view.render());
    res.send(layout.render());
  }

  store(req: any, res: any) {
    const { name, path, method, body } = req.body;
    const endpoint = new EndpointModel('', name, path, method, body);
    endpoint.save();
    res.redirect('/endpoints');
  }

  delete(req: any, res: any) {
    const { id } = req.params;
    const endpoint = EndpointModel.getById(id);
    if (!endpoint) {
      res.status(404).send('Endpoint not found');
      return;
    }
    endpoint.delete();
    res.redirect('/endpoints');
  }

  edit(req: any, res: any) {
    const { id } = req.params;
    const endpoint = EndpointModel.getById(id);
    if (!endpoint) {
      res.status(404).send('Endpoint not found');
      return;
    }
    const view = new EndpointUpdateView(endpoint);
    const layout = new Layout('Mock API Studio - Update Endpoint', view.render());
    res.send(layout.render());
  }

  update(req: any, res: any) {
    const { id } = req.params;
    const endpoint = EndpointModel.getById(id);
    if (!endpoint) {
      res.status(404).send('Endpoint not found');
      return;
    }
    const { name, path, method, body } = req.body;
    endpoint.name = name;
    endpoint.path = path;
    endpoint.method = method;
    endpoint.body = body;
    endpoint.update();
    res.redirect('/endpoints');
  }
}