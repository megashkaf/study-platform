const Database = require('better-sqlite3');
const db = new Database('./database.db');

// Создание таблицы пользователей, если не существует
// db.prepare(`
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     email TEXT UNIQUE,
//     password TEXT,
//     verified INTEGER DEFAULT 0,
//     verification_token TEXT,
//     created_at TEXT DEFAULT CURRENT_TIMESTAMP
//   )
// `).run();

module.exports = db;