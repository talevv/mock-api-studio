export class EndpointModel {
  id: string;
  name: string;
  path: string;
  method: string;
  body: string;

  constructor(id: string, name: string, path: string, method: string, body: string) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.method = method;
    this.body = body;
  }

  static getAll(): EndpointModel[] {
    return [
      new EndpointModel('1', 'Get Users', '/users', 'GET', ''),
      new EndpointModel('2', 'Create User', '/users', 'POST', '{"name": "John Doe"}'),
    ];
  }

  static getById(id: string): EndpointModel | null {
    return new EndpointModel(id, `Endpoint ${id}`, '/users', 'GET', '');
  }

  save(): void {
    console.log(`Saving endpoint: ${this.name}`);
  }
}