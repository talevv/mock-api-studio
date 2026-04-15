
export const migrations = [
  {
    name: 'create_endpoints_table',
    sql: `CREATE TABLE IF NOT EXISTS endpoints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      method TEXT NOT NULL,
      body TEXT,
      active BOOLEAN DEFAULT 0,
      sort_order INTEGER DEFAULT 0
    )`
  }
];
