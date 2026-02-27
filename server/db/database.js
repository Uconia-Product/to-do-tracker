const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'todo.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
db.exec(schema);

const inbox = db.prepare('SELECT * FROM projects WHERE is_inbox = 1').get();
if (!inbox) {
  db.prepare('INSERT INTO projects (name, color, is_inbox, position) VALUES (?, ?, 1, 0)')
    .run('Inbox', '#6366f1');
}

module.exports = db;
