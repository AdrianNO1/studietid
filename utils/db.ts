import Database from 'better-sqlite3';

const db = new Database('./db.sqlite', { });

// read from initdb.sql and execute the commands
const initDb = require('fs').readFileSync('./sql/initdb.sql', 'utf-8');
db.exec(initDb);

`CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    password TEXT,
    salt TEXT,
    token TEXT,
    isAdmin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subjectnavn TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Rom (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    romnavn TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Studietid (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bruker_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    rom_id INTEGER NOT NULL,
    datetime DATE NOT NULL,
    timer INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('venter på godkjenning', 'godkjent', 'avvist')),
    comment TEXT NOT NULL DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bruker_id) REFERENCES Users(id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(id),
    FOREIGN KEY (rom_id) REFERENCES Rom(id)
);`

// Add dummy data for rooms and subjects
db.exec(`INSERT OR IGNORE INTO Subjects (subjectnavn) VALUES ('Matematikk'), ('Fysikk'), ('Kjemi'), ('Biologi'), ('Historie'), ('Samfunnsfag'), ('Engelsk'), ('Norsk'), ('Kroppsøving'), ('Kunst og håndverk'), ('Musikk'), ('Mat og helse'), ('Naturfag')`);
db.exec(`INSERT OR IGNORE INTO Rom (romnavn) VALUES 
('347'), 
('469'), 
('666'), 
('534'), 
('355'), 
('123'), 
('234'), 
('345'), 
('456'), 
('567'), 
('678'), 
('789'), 
('890')`);

export default db;
