CREATE TABLE IF NOT EXISTS Users (
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
    kommentar TEXT NOT NULL DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bruker_id) REFERENCES Users(id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(id),
    FOREIGN KEY (rom_id) REFERENCES Rom(id)
);