import { db } from "../db/db-sqlite";

export class EndpointModel {
  id: string;
  name: string;
  path: string;
  method: string;
  body: string;
  active: boolean = false;
  sortOrder: number = 0;

  constructor(id: string, name: string, path: string, method: string, body: string, active: boolean = false, sortOrder: number = 0) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.method = method;
    this.body = body;
    this.active = active;
    this.sortOrder = sortOrder;
  }

  static getAll(): EndpointModel[] {
    return db.prepare('SELECT * FROM endpoints ORDER BY sort_order ASC').all().map((row: any) => new EndpointModel(row.id, row.name, row.path, row.method, row.body, row.active, row.sort_order));
  }

  static getById(id: string): EndpointModel | null {
    const endpoint: any = db.prepare('SELECT * FROM endpoints WHERE id = ?').get(id);
    return endpoint ? new EndpointModel(endpoint.id, endpoint.name, endpoint.path, endpoint.method, endpoint.body, endpoint.active, endpoint.sort_order) : null;
  }

  static activate(ids: string[]): EndpointModel[] {
    db.prepare('UPDATE endpoints SET active = CASE WHEN id IN (' + ids.map(() => '?').join(',') + ') THEN 1 ELSE 0 END').run(...ids);
    return this.getAll();
  }

  save(): void {
    const row: any = db.prepare('SELECT MAX(sort_order) AS max_sort_order FROM endpoints').get();
    const nextSortOrder = (row?.max_sort_order ?? 0) + 1;
    this.sortOrder = nextSortOrder;
    const activeValue = this.active ? 1 : 0;
    db.prepare('INSERT INTO endpoints (name, path, method, body, active, sort_order) VALUES (?, ?, ?, ?, ?, ?)')
      .run(this.name, this.path, this.method, this.body, activeValue, this.sortOrder);
  }

  delete(): void {
    db.prepare('DELETE FROM endpoints WHERE id = ?').run(this.id);
  }

  update(): void {
    const activeValue = this.active ? 1 : 0;
    db.prepare('UPDATE endpoints SET name = ?, path = ?, method = ?, body = ?, active = ?, sort_order = ? WHERE id = ?')
      .run(this.name, this.path, this.method, this.body, activeValue, this.sortOrder, this.id);
  }
}