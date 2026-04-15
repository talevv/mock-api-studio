import { memoryDb } from "../db/db-memory";

// TODO migrate to use SQLite or similar for better data management and persistence
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
    return memoryDb.getAll().map((row: any) => new EndpointModel(row.id, row.name, row.path, row.method, row.body, row.active));
  }

  static getById(id: string): EndpointModel | null {
    const endpoints = EndpointModel.getAll();
    return endpoints.find(endpoint => endpoint.id === id) || null;
  }

  static activate(ids: string[]): EndpointModel[] {
    const endpoints = memoryDb.activate(ids);
    return endpoints.map(row => new EndpointModel(row.id, row.name, row.path, row.method, row.body, row.active));
  }

  save(): void {
    console.log(`Saving endpoint: ${this.name}`);
    memoryDb.save({
      id: memoryDb.getAll().length + 1 + '', // simple auto-increment id
      name: this.name,
      body: this.body,
      method: this.method,
      active: false,
      path: this.path
    });
  }

  delete(): void {
    memoryDb.delete(this.id);
  }

  update(): void {
    memoryDb.update(this.id, {
      name: this.name,
      body: this.body,
      method: this.method,
      active: this.active,
      path: this.path
    });
  }
}