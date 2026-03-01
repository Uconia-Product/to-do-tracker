import { getAll, setAll, nextId, now, ensureInbox, PROJECTS_KEY } from './storage';

const resolve = (val) => Promise.resolve(val);

// ---------------------------------------------------------------------------
// GET /projects
// ---------------------------------------------------------------------------
export function getProjects() {
  ensureInbox(); // guarantee Inbox always exists
  return resolve(getAll(PROJECTS_KEY));
}

// ---------------------------------------------------------------------------
// POST /projects
// ---------------------------------------------------------------------------
export function createProject(data) {
  const projects = getAll(PROJECTS_KEY);
  const maxPos = projects.length ? Math.max(...projects.map(p => p.position)) : -1;

  const project = {
    id: nextId(projects),
    name: data.name,
    color: data.color || '#6366f1',
    is_inbox: 0,
    position: maxPos + 1,
    created_at: now(),
  };

  setAll(PROJECTS_KEY, [...projects, project]);
  return resolve({ ...project });
}

// ---------------------------------------------------------------------------
// PUT /projects/:id
// ---------------------------------------------------------------------------
export function updateProject(id, data) {
  const projects = getAll(PROJECTS_KEY);
  const project = projects.find(p => p.id === Number(id));
  if (!project) return Promise.reject(new Error('Project not found'));

  const updated = {
    ...project,
    name: data.name ?? project.name,
    color: data.color ?? project.color,
  };

  setAll(PROJECTS_KEY, projects.map(p => (p.id === Number(id) ? updated : p)));
  return resolve({ ...updated });
}

// ---------------------------------------------------------------------------
// DELETE /projects/:id
// ---------------------------------------------------------------------------
export function deleteProject(id) {
  const projects = getAll(PROJECTS_KEY);
  setAll(PROJECTS_KEY, projects.filter(p => p.id !== Number(id)));
  return resolve({ success: true });
}
