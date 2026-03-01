// ---------------------------------------------------------------------------
// localStorage keys
// ---------------------------------------------------------------------------
export const TASKS_KEY = 'todo_tracker_tasks';
export const PROJECTS_KEY = 'todo_tracker_projects';

// ---------------------------------------------------------------------------
// Raw read / write helpers
// ---------------------------------------------------------------------------
export function getAll(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

export function setAll(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

// ---------------------------------------------------------------------------
// ID generation
// ---------------------------------------------------------------------------
export function nextId(items) {
  if (!items || items.length === 0) return 1;
  return Math.max(...items.map(i => i.id)) + 1;
}

// ---------------------------------------------------------------------------
// Timestamp helper
// ---------------------------------------------------------------------------
export function now() {
  return new Date().toISOString();
}

// ---------------------------------------------------------------------------
// Ensure the Inbox project exists (called on startup and before task creation)
// ---------------------------------------------------------------------------
export function ensureInbox() {
  const projects = getAll(PROJECTS_KEY);
  const existing = projects.find(p => p.is_inbox);
  if (existing) return existing;

  const inbox = {
    id: 1,
    name: 'Inbox',
    color: '#6366f1',
    is_inbox: 1,
    position: 0,
    created_at: now(),
  };
  setAll(PROJECTS_KEY, [inbox, ...projects]);
  return inbox;
}
