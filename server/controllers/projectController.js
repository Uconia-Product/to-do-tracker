const db = require('../db/database');

exports.getAllProjects = (req, res) => {
  const projects = db.prepare('SELECT * FROM projects ORDER BY position ASC, created_at ASC').all();
  res.json(projects);
};

exports.createProject = (req, res) => {
  const { name, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const maxPos = db.prepare('SELECT MAX(position) as max FROM projects').get();
  const position = (maxPos.max ?? -1) + 1;

  const result = db.prepare(
    'INSERT INTO projects (name, color, position) VALUES (?, ?, ?)'
  ).run(name, color || '#6366f1', position);

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(project);
};

exports.updateProject = (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (project.is_inbox) return res.status(400).json({ error: 'Cannot modify Inbox' });

  db.prepare('UPDATE projects SET name = ?, color = ? WHERE id = ?').run(
    name ?? project.name,
    color ?? project.color,
    id
  );
  res.json(db.prepare('SELECT * FROM projects WHERE id = ?').get(id));
};

exports.deleteProject = (req, res) => {
  const { id } = req.params;
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (project.is_inbox) return res.status(400).json({ error: 'Cannot delete Inbox' });

  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  res.json({ success: true });
};
