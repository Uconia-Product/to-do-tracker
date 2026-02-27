const db = require('../db/database');

exports.getTasks = (req, res) => {
  const { project_id, filter } = req.query;

  let query = 'SELECT * FROM tasks WHERE parent_task_id IS NULL';
  const params = [];

  if (filter === 'today') {
    query += " AND due_date = date('now')";
  } else if (filter === 'upcoming') {
    query += " AND due_date >= date('now') AND due_date <= date('now', '+7 days')";
  } else if (project_id) {
    query += ' AND project_id = ?';
    params.push(project_id);
  }

  query += ' ORDER BY completed ASC, position ASC, created_at DESC';

  const tasks = db.prepare(query).all(...params);

  const withSubtasks = tasks.map(task => ({
    ...task,
    subtasks: db.prepare(
      'SELECT * FROM tasks WHERE parent_task_id = ? ORDER BY position ASC'
    ).all(task.id),
  }));

  res.json(withSubtasks);
};

exports.createTask = (req, res) => {
  const { title, description, priority, due_date, project_id, parent_task_id } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  let pid = project_id;
  if (!pid) {
    const inbox = db.prepare('SELECT id FROM projects WHERE is_inbox = 1').get();
    pid = inbox?.id;
  }

  const maxPos = db.prepare('SELECT MAX(position) as max FROM tasks WHERE project_id = ?').get(pid);
  const position = (maxPos.max ?? -1) + 1;

  const result = db.prepare(
    'INSERT INTO tasks (title, description, priority, due_date, project_id, parent_task_id, position) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(
    title,
    description || null,
    priority || 4,
    due_date || null,
    pid,
    parent_task_id || null,
    position
  );

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  task.subtasks = [];
  res.status(201).json(task);
};

exports.updateTask = (req, res) => {
  const { id } = req.params;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { title, description, priority, due_date, project_id } = req.body;

  db.prepare(
    'UPDATE tasks SET title = ?, description = ?, priority = ?, due_date = ?, project_id = ? WHERE id = ?'
  ).run(
    title ?? task.title,
    description !== undefined ? description : task.description,
    priority ?? task.priority,
    due_date !== undefined ? due_date : task.due_date,
    project_id ?? task.project_id,
    id
  );

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  updated.subtasks = db.prepare(
    'SELECT * FROM tasks WHERE parent_task_id = ? ORDER BY position ASC'
  ).all(id);
  res.json(updated);
};

exports.toggleTask = (req, res) => {
  const { id } = req.params;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const newCompleted = task.completed ? 0 : 1;
  const completedAt = newCompleted ? new Date().toISOString() : null;

  db.prepare('UPDATE tasks SET completed = ?, completed_at = ? WHERE id = ?').run(
    newCompleted, completedAt, id
  );

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  updated.subtasks = db.prepare(
    'SELECT * FROM tasks WHERE parent_task_id = ? ORDER BY position ASC'
  ).all(id);
  res.json(updated);
};

exports.reorderTask = (req, res) => {
  const { id } = req.params;
  const { position } = req.body;
  db.prepare('UPDATE tasks SET position = ? WHERE id = ?').run(position, id);
  res.json({ success: true });
};

exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.json({ success: true });
};

exports.getSubtasks = (req, res) => {
  const { id } = req.params;
  const subtasks = db.prepare(
    'SELECT * FROM tasks WHERE parent_task_id = ? ORDER BY position ASC'
  ).all(id);
  res.json(subtasks);
};

exports.createSubtask = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const parentTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!parentTask) return res.status(404).json({ error: 'Parent task not found' });

  const maxPos = db.prepare('SELECT MAX(position) as max FROM tasks WHERE parent_task_id = ?').get(id);
  const position = (maxPos.max ?? -1) + 1;

  const result = db.prepare(
    'INSERT INTO tasks (title, project_id, parent_task_id, position) VALUES (?, ?, ?, ?)'
  ).run(title, parentTask.project_id, id, position);

  const subtask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(subtask);
};
