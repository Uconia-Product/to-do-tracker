CREATE TABLE IF NOT EXISTS projects (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  color      TEXT DEFAULT '#6366f1',
  is_inbox   INTEGER DEFAULT 0,
  position   INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  title          TEXT NOT NULL,
  description    TEXT,
  completed      INTEGER DEFAULT 0,
  priority       INTEGER DEFAULT 4,
  due_date       TEXT,
  project_id     INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  parent_task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  position       INTEGER DEFAULT 0,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at   DATETIME
);
