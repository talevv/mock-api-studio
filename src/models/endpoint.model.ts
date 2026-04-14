// This is a simple in-memory model for API endpoints. In a real application, this would be replaced with a database or persistent storage layer.
const endpointsDbRows = [
  { id: '1', name: 'Get Users', path: '/users', method: 'GET', body: '', active: true },
  { id: '2', name: 'Create User', path: '/users', method: 'POST', body: '{"name": "John Doe"}', active: false },
  { id: '3', name: 'Update User', path: '/users/:id', method: 'PUT', body: '{"name": "John Doe Updated"}', active: false },
  { id: '4', name: 'Delete User', path: '/users/:id', method: 'DELETE', body: '', active: false },
];

export class EndpointModel {
  id: string;
  name: string;
  path: string;
  method: string;
  body: string;
  active: boolean = false;

  constructor(id: string, name: string, path: string, method: string, body: string, active: boolean = false) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.method = method;
    this.body = body;
    this.active = active;
  }

  static getAll(): EndpointModel[] {
    return endpointsDbRows.map(row => new EndpointModel(row.id, row.name, row.path, row.method, row.body, row.active));
  }

  static getById(id: string): EndpointModel | null {
    const endpoints = EndpointModel.getAll();
    return endpoints.find(endpoint => endpoint.id === id) || null;
  }

  static activate(ids: string[]): EndpointModel[] {
    // modify the in-memory database to reflect the new active states
    for (const endpoint of endpointsDbRows) {
      endpoint.active = ids.includes(endpoint.id);
    }

    return endpointsDbRows.map(row => new EndpointModel(row.id, row.name, row.path, row.method, row.body, row.active));
  }

  save(): void {
    console.log(`Saving endpoint: ${this.name}`);
    endpointsDbRows.push({
      id: endpointsDbRows.length + 1 + '', // simple auto-increment id
      name: this.name,
      body: this.body,
      method: this.method,
      active: false,
      path: this.path
    });
  }
}