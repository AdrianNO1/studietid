// lib/db.ts
import Database from 'better-sqlite3';

const db = new Database('./db.sqlite', { verbose: console.log });

// Create table if it doesn't exist
db.exec(`
	CREATE TABLE IF NOT EXISTS Users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		email TEXT,
		password TEXT,
		salt TEXT,
		token TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)
`);

// Add the new column if it doesn't exist
// db.exec(`
// 	ALTER TABLE Users ADD COLUMN token TEXT
// `);

export default db;
