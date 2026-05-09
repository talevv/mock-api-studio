import { Endpoint } from "../models/endpoint.model";
import { Controller, Route } from "../types";
import { mapMethodToColor, zip } from "../helpers/helpers";
import { logger } from "../logger";
import { ServerState, ServerStatus } from "../shared/server-state";
import { EventEmitter } from "stream";

export class EndpointController implements Controller {
  constructor(private readonly serverState: ServerState, private readonly serverEmitter: EventEmitter) {}

  routing: Route[] = [
    { method: 'get', path: '/endpoints', handler: this.index },
    { method: 'get', path: '/endpoints/create', handler: this.create },
    { method: 'post', path: '/endpoints/create', handler: this.store },
    { method: 'post', path: '/endpoints/:id/toggle', handler: this.toggle },
    { method: 'get', path: '/endpoints/:id', handler: this.show },
    { method: 'post', path: '/endpoints/:id/delete', handler: this.delete },
    { method: 'get', path: '/endpoints/:id/edit', handler: this.edit },
    { method: 'post', path: '/endpoints/:id/update', handler: this.update},
    { method: 'post', path: '/endpoints/:id/move', handler: this.move },
    { method: 'delete', path: '/endpoints/header-row/delete', handler: this.removeHeaderRow },
    { method: 'post', path: '/endpoints/header-row/create', handler: this.addHeaderRow },
  ]

  async index(req: any, res: any) {
    const endpoints = await Endpoint.find({ order: { sortOrder: 'ASC' } });
    const endpointsWithStyles = endpoints.map((endpoint, index) => ({
      ...endpoint,
      bgClass: index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
      methodColor: mapMethodToColor(endpoint.method),
    }));

    const updateSuccess = req.session.updateSuccess;
    delete req.session.updateSuccess;
    const createSuccess = req.session.createSuccess;
    delete req.session.createSuccess;

    res.render('endpoints-list', {
      title: 'Mock API Studio - Endpoints',
      endpoints: endpointsWithStyles,
      updateSuccess: updateSuccess,
      createSuccess: createSuccess,
      serverRunning: this.serverState.getStatus() === ServerStatus.RUNNING,
    });
  }

  async show(req: any, res: any) {
    const { id } = req.params;
    const endpoint = await Endpoint.findOneBy({ id: parseInt(id) });

    if (!endpoint) {
      logger.error(`Endpoint with id ${id} not found`);
      res.status(404).send('Endpoint not found');
      return;
    }

    res.render('endpoint-show', {
      title: 'Mock API Studio - Endpoint',
      endpoint,
      methodColor: mapMethodToColor(endpoint.method),
      serverRunning: this.serverState.getStatus() === ServerStatus.RUNNING,
    });
  }
  
  async toggle(req: any, res: any) {
    const { id } = req.params;
    const endpoint = await Endpoint.findOneBy({ id: parseInt(id) });
    if (!endpoint) {
      logger.error(`Endpoint with id ${id} not found`);
      res.status(404).send('Endpoint not found');
      return;
    }
    endpoint.active = !endpoint.active;
    await endpoint.save();
    this.serverEmitter.emit('restart');
    res.status(200).send('Endpoint updated successfully');
  }

  create(req: any, res: any) {
    res.render('endpoint-create', {
      title: 'Mock API Studio - Create Endpoint',
      serverRunning: this.serverState.getStatus() === ServerStatus.RUNNING,
    });
  }

  async store(req: any, res: any) {
    const { name, path, method, body, status, delay, header_name, header_value } = req.body;
    const endpoint = new Endpoint();
    endpoint.name = name;
    endpoint.path = path;
    endpoint.method = method;
    endpoint.status = status ? parseInt(status) : 200;
    endpoint.delay = delay ? parseInt(delay) : 0;
    endpoint.body = body;
    endpoint.sortOrder = (await Endpoint.count()) + 1;
    endpoint.active = true;
    // zip header_name and header_value into an object and save as json string in headers column
    if (header_name && header_value && Array.isArray(header_name) && Array.isArray(header_value)) {
      const headers: Record<string, string> = zip(header_name, header_value);
      endpoint.headers = JSON.stringify(headers);
    } else {
      endpoint.headers = '{}';
    }
    await endpoint.save();
    this.serverEmitter.emit('restart');
    req.session.createSuccess = true;
    res.redirect('/endpoints');
  }

  async delete(req: any, res: any) {
    const { id } = req.params;
    const endpoint = await Endpoint.findOneBy({ id: parseInt(id) });
    if (!endpoint) {
      logger.error(`Endpoint with id ${id} not found`);
      res.status(404).send('Endpoint not found');
      return;
    }
    await endpoint.remove();
    this.serverEmitter.emit('restart');
    res.redirect('/endpoints');
  }

  async edit(req: any, res: any) {
    const { id } = req.params;
    const endpoint = await Endpoint.findOneBy({ id: parseInt(id) });

    if (!endpoint) {
      logger.error(`Endpoint with id ${id} not found`);
      res.status(404).send('Endpoint not found');
      return;
    }

    const headers = endpoint.headers ? JSON.parse(endpoint.headers) : {};
    const headersArray = Object.entries(headers).map(([name, value]) => ({ name, value }));

    res.render('endpoint-update', {
      title: 'Mock API Studio - Update Endpoint',
      endpoint,
      headers: headersArray,
      serverRunning: this.serverState.getStatus() === ServerStatus.RUNNING,
    });
  }

  async update(req: any, res: any) {
    const { id } = req.params;
    const endpoint = await Endpoint.findOneBy({ id: parseInt(id) });
    if (!endpoint) {
      logger.error(`Endpoint with id ${id} not found`);
      res.status(404).send('Endpoint not found');
      return;
    }
    const { name, path, method, body, status, delay, header_name, header_value } = req.body;
    endpoint.name = name;
    endpoint.path = path;
    endpoint.method = method;
    endpoint.body = body;
    endpoint.status = status ? parseInt(status) : 200;
    endpoint.delay = delay ? parseInt(delay) : 0;
    // zip header_name and header_value into an object and save as json string in headers column
    if (header_name && header_value && Array.isArray(header_name) && Array.isArray(header_value)) {
      const headers: Record<string, string> = zip(header_name, header_value);
      endpoint.headers = JSON.stringify(headers);
    } else {
      endpoint.headers = '{}';
    }
    await endpoint.save();
    this.serverEmitter.emit('restart');
    req.session.updateSuccess = true;
    res.redirect('/endpoints');
  }

  async move(req: any, res: any) {
    const { id } = req.params;
    const { direction } = req.body;
    const endpoints = await Endpoint.find({ order: { sortOrder: 'ASC' } })
    const index = endpoints.findIndex(e => e.id?.toString() === id);
    if (index === -1) {
      logger.error(`Endpoint with id ${id} not found`);
      res.status(404).send('Endpoint not found');
      return;
    }
    if (direction === 'up' && index > 0) {
      [endpoints[index].sortOrder, endpoints[index - 1].sortOrder] = [endpoints[index - 1].sortOrder, endpoints[index].sortOrder];
      await endpoints[index].save();
      await endpoints[index - 1].save();
    } else if (direction === 'down' && index < endpoints.length - 1) {
      [endpoints[index].sortOrder, endpoints[index + 1].sortOrder] = [endpoints[index + 1].sortOrder, endpoints[index].sortOrder];
      await endpoints[index].save();
      await endpoints[index + 1].save();
    }
    this.serverEmitter.emit('restart');
    res.redirect('/endpoints');
  }

  removeHeaderRow(req: any, res: any) {
    res.status(200).send('Header row deleted successfully');
  }

  addHeaderRow(req: any, res: any) {
    res.render('header-row', {
      layout: false,
    });
  }
}