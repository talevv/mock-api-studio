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
    return [
      new EndpointModel('1', 'Get Users', '/users', 'GET', '', true),
      new EndpointModel('2', 'Create User', '/users', 'POST', '{"name": "John Doe"}', false),
    ];
  }

  static getById(id: string): EndpointModel | null {
    const endpoints = EndpointModel.getAll();
    return endpoints.find(endpoint => endpoint.id === id) || null;
  }

  save(): void {
    console.log(`Saving endpoint: ${this.name}`);
  }
}