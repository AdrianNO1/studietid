// lib/db.ts
import Database from 'better-sqlite3';

const db = new Database('./db.sqlite', { });

// read from initdb.sql and execute the commands
const initDb = require('fs').readFileSync('./sql/initdb.sql', 'utf-8');
db.exec(initDb);

// Add the new column if it doesn't exist
// db.exec(`
// 	ALTER TABLE Users ADD COLUMN token TEXT
// `);

export default db;
