import Database from 'better-sqlite3';

const db = new Database('./db.sqlite', { });

// read from initdb.sql and execute the commands
const initDb = require('fs').readFileSync('./sql/initdb.sql', 'utf-8');
db.exec(initDb);

// Add the new column to Users named isAdmin
// db.exec(`
// 	ALTER TABLE Users ADD COLUMN isAdmin INTEGER DEFAULT 0;
// `);

// set all the kommentar to "" in Studietid
// db.exec(`
// 	UPDATE Studietid SET kommentar = '';
// `);

// rename the column kommentar to comment in Studietid
// db.exec(`
// 	ALTER TABLE Studietid RENAME COLUMN kommentar TO comment;
// `);

export default db;
