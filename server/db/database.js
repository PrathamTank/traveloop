const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'traveloop.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            profile_photo TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Trips Table
        db.run(`CREATE TABLE IF NOT EXISTS trips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            start_date DATE,
            end_date DATE,
            cover_photo TEXT,
            is_public BOOLEAN DEFAULT 0,
            share_token TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )`);

        // Stops Table
        db.run(`CREATE TABLE IF NOT EXISTS stops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            trip_id INTEGER NOT NULL,
            city_name TEXT NOT NULL,
            start_date DATE,
            end_date DATE,
            position_order INTEGER NOT NULL,
            FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
        )`);

        // Activities Table
        db.run(`CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            stop_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            cost REAL DEFAULT 0,
            duration TEXT,
            category TEXT,
            image_url TEXT,
            FOREIGN KEY (stop_id) REFERENCES stops (id) ON DELETE CASCADE
        )`);

        // Budgets Table (Overall budget per trip)
        db.run(`CREATE TABLE IF NOT EXISTS budgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            trip_id INTEGER NOT NULL UNIQUE,
            total_estimated REAL DEFAULT 0,
            FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
        )`);

        // Packing Items Table
        db.run(`CREATE TABLE IF NOT EXISTS packing_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            trip_id INTEGER NOT NULL,
            category TEXT NOT NULL,
            item_name TEXT NOT NULL,
            is_packed BOOLEAN DEFAULT 0,
            FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
        )`);

        // Notes Table
        db.run(`CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            trip_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
        )`);

        // PRAGMA to enforce foreign keys
        db.run(`PRAGMA foreign_keys = ON;`);
    });
}

module.exports = db;
