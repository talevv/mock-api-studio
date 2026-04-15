import Database from 'better-sqlite3';
import { migrations } from './migrations';

export const db = new Database('mock-api.db', { verbose: console.log });

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
