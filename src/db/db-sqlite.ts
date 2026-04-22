import Database from 'better-sqlite3';
import envPaths from 'env-paths';
import path from 'path';
import fs from 'fs';
import { migrations } from './migrations';

const getDbPath = () => {
  const paths = envPaths('mock-api');

  if (!fs.existsSync(paths.data)) {
    fs.mkdirSync(paths.data, { recursive: true });
  }
  
  console.log(`Using database path: ${paths.data}`);
  return path.join(paths.data, 'mock-api.db');
};


export const db = new Database(getDbPath(), { verbose: console.log });

const createMigrationsTable = `CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  run_on DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

export function runMigrations() {
  db.exec(createMigrationsTable);

  const appliedMigrations = db.prepare('SELECT name FROM migrations').all().map((row: any) => row.name);
  
  for (const migration of migrations) {
    if (!appliedMigrations.includes(migration.name)) {
      console.log(`Running migration: ${migration.name}`);
      db.exec(migration.sql);
      db.prepare('INSERT INTO migrations (name) VALUES (?)').run(migration.name);
    }
  }
}
