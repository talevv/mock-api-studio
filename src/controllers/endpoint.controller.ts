import { EndpointModel } from "../models/endpoint.model";
import { Controller, Route } from "../types";
import { mapMethodToColor } from "../helpers/helpers";
import { logger } from "../logger";

export class EndpointController implements Controller {
  routing: Route[] = [
    { method: 'get', path: '/endpoints', handler: this.index },
    { method: 'get', path: '/endpoints/create', handler: this.create },
    { method: 'post', path: '/endpoints/create', handler: this.store },
    { method: 'post', path: '/endpoints/:id/toggle', handler: this.toggle },
    { method: 'get', path: '/endpoints/:id', handler: this.show },
    { method: 'post', path: '/endpoints/:id/delete', handler: this.delete },
    { method: 'get', path: '/endpoints/:id/edit', handler: this.edit },
    { method: 'post', path: '/endpoints/:id/update', handler: this.update},
    { method: 'post', path: '/endpoints/:id/move', handler: this.move }
  ]

  index(req: any, res: any) {
    const endpoints = EndpointModel.getAll().map((endpoint, index) => ({
      ...endpoint,
      bgClass: index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
      methodColor: mapMethodToColor(endpoint.method),
    }));

    res.render('endpoints-list', {
      title: 'Mock API Studio - Endpoints',
      endpoints,
      updateSuccess: false,
    });
  }

  show(req: any, res: any) {
    const { id } = req.params;
    const endpoint = EndpointModel.getById(id);
    if (!endpoint) {
      logger.error(`Endpoint with id ${id} not found`);
      res.status(404).send('Endpoint not found');
      return;
    }

    res.render('endpoint-show', {
      title: 'Mock API Studio - Endpoint',
      endpoint,
      methodColor: mapMethodToColor(endpoint.method),
    });
  }
  
  toggle(req: any, res: any) {
    const { id } = req.params;
    const endpoint = EndpointModel.getById(id);
    if (!endpoint) {
      logger.error(`Endpoint with id ${id} not found`);
      res.status(404).send('Endpoint not found');
      return;
    }
    endpoint.active = !endpoint.active;
    endpoint.update();
    res.status(200).send('Endpoint updated successfully');
  }

  create(req: any, res: any) {
    res.render('endpoint-create', {
      title: 'Mock API Studio - Create Endpoint',
    });
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
      logger.error(`Endpoint with id ${id} not found`);
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
      logger.error(`Endpoint with id ${id} not found`);
      res.status(404).send('Endpoint not found');
      return;
    }

    res.render('endpoint-update', {
      title: 'Mock API Studio - Update Endpoint',
      endpoint,
    });
  }

  update(req: any, res: any) {
    const { id } = req.params;
    const endpoint = EndpointModel.getById(id);
    if (!endpoint) {
      logger.error(`Endpoint with id ${id} not found`);
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

  move(req: any, res: any) {
    const { id } = req.params;
    const { direction } = req.body;
    const endpoints = EndpointModel.getAll();
    const index = endpoints.findIndex(e => e.id?.toString() === id);
    if (index === -1) {
      logger.error(`Endpoint with id ${id} not found`);
      res.status(404).send('Endpoint not found');
      return;
    }
    if (direction === 'up' && index > 0) {
      [endpoints[index].sortOrder, endpoints[index - 1].sortOrder] = [endpoints[index - 1].sortOrder, endpoints[index].sortOrder];
      endpoints[index].update();
      endpoints[index - 1].update();
    } else if (direction === 'down' && index < endpoints.length - 1) {
      [endpoints[index].sortOrder, endpoints[index + 1].sortOrder] = [endpoints[index + 1].sortOrder, endpoints[index].sortOrder];
      endpoints[index].update();
      endpoints[index + 1].update();
    }
    res.redirect('/endpoints');
  }
}