import { format, addDays, startOfDay } from 'date-fns';
import { getAll, setAll, nextId, now, ensureInbox, TASKS_KEY } from './storage';

// Wrap a value in a resolved Promise to keep the same async interface
// that TaskContext expects (it always awaits these calls).
const resolve = (val) => Promise.resolve(val);

// ---------------------------------------------------------------------------
// GET /tasks  (filter: 'today' | 'upcoming' | undefined, project_id)
// ---------------------------------------------------------------------------
export function getTasks(params = {}) {
  const { project_id, filter } = params;
  const allTasks = getAll(TASKS_KEY);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const inSevenStr = format(addDays(startOfDay(new Date()), 7), 'yyyy-MM-dd');

  // Root tasks only (no subtasks)
  let tasks = allTasks.filter(t => !t.parent_task_id);

  if (filter === 'today') {
    tasks = tasks.filter(t => t.due_date === todayStr);
  } else if (filter === 'upcoming') {
    tasks = tasks.filter(
      t => t.due_date && t.due_date >= todayStr && t.due_date <= inSevenStr
    );
  } else if (project_id) {
    tasks = tasks.filter(t => t.project_id === Number(project_id));
  }

  // Completed last → position ascending → newest first
  tasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed - b.completed;
    if (a.position !== b.position) return a.position - b.position;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  // Attach subtasks
  const withSubtasks = tasks.map(task => ({
    ...task,
    subtasks: allTasks
      .filter(t => t.parent_task_id === task.id)
      .sort((a, b) => a.position - b.position),
  }));

  return resolve(withSubtasks);
}

// ---------------------------------------------------------------------------
// POST /tasks
// ---------------------------------------------------------------------------
export function createTask(data) {
  const allTasks = getAll(TASKS_KEY);

  // Fall back to Inbox if no project supplied
  let pid = data.project_id ? Number(data.project_id) : null;
  if (!pid) {
    const inbox = ensureInbox();
    pid = inbox.id;
  }

  // Next position within the target project
  const projectTasks = allTasks.filter(
    t => t.project_id === pid && !t.parent_task_id
  );
  const maxPos = projectTasks.length
    ? Math.max(...projectTasks.map(t => t.position))
    : -1;

  const task = {
    id: nextId(allTasks),
    title: data.title,
    description: data.description || null,
    completed: 0,
    priority: data.priority ?? 4,
    due_date: data.due_date || null,
    project_id: pid,
    parent_task_id: null,
    position: maxPos + 1,
    created_at: now(),
    completed_at: null,
    subtasks: [],
  };

  setAll(TASKS_KEY, [...allTasks, task]);
  return resolve({ ...task });
}

// ---------------------------------------------------------------------------
// PUT /tasks/:id
// ---------------------------------------------------------------------------
export function updateTask(id, data) {
  const allTasks = getAll(TASKS_KEY);
  const task = allTasks.find(t => t.id === Number(id));
  if (!task) return Promise.reject(new Error('Task not found'));

  const updated = {
    ...task,
    title: data.title ?? task.title,
    description: data.description !== undefined ? data.description : task.description,
    priority: data.priority ?? task.priority,
    due_date: data.due_date !== undefined ? data.due_date : task.due_date,
    project_id: data.project_id ?? task.project_id,
  };

  setAll(TASKS_KEY, allTasks.map(t => (t.id === Number(id) ? updated : t)));

  const subtasks = allTasks
    .filter(t => t.parent_task_id === Number(id))
    .sort((a, b) => a.position - b.position);

  return resolve({ ...updated, subtasks });
}

// ---------------------------------------------------------------------------
// PATCH /tasks/:id/toggle
// ---------------------------------------------------------------------------
export function toggleTask(id) {
  const allTasks = getAll(TASKS_KEY);
  const task = allTasks.find(t => t.id === Number(id));
  if (!task) return Promise.reject(new Error('Task not found'));

  const newCompleted = task.completed ? 0 : 1;
  const updated = {
    ...task,
    completed: newCompleted,
    completed_at: newCompleted ? now() : null,
  };

  setAll(TASKS_KEY, allTasks.map(t => (t.id === Number(id) ? updated : t)));

  const subtasks = allTasks
    .filter(t => t.parent_task_id === Number(id))
    .sort((a, b) => a.position - b.position);

  return resolve({ ...updated, subtasks });
}

// ---------------------------------------------------------------------------
// PATCH /tasks/:id/reorder
// ---------------------------------------------------------------------------
export function reorderTask(id, position) {
  const allTasks = getAll(TASKS_KEY);
  setAll(TASKS_KEY, allTasks.map(t => (t.id === Number(id) ? { ...t, position } : t)));
  return resolve({ success: true });
}

// ---------------------------------------------------------------------------
// DELETE /tasks/:id
// ---------------------------------------------------------------------------
export function deleteTask(id) {
  const allTasks = getAll(TASKS_KEY);
  // Remove task and any subtasks
  setAll(
    TASKS_KEY,
    allTasks.filter(t => t.id !== Number(id) && t.parent_task_id !== Number(id))
  );
  return resolve({ success: true });
}

// ---------------------------------------------------------------------------
// GET /tasks/:taskId/subtasks
// ---------------------------------------------------------------------------
export function getSubtasks(taskId) {
  const allTasks = getAll(TASKS_KEY);
  const subtasks = allTasks
    .filter(t => t.parent_task_id === Number(taskId))
    .sort((a, b) => a.position - b.position);
  return resolve(subtasks);
}

// ---------------------------------------------------------------------------
// POST /tasks/:taskId/subtasks
// ---------------------------------------------------------------------------
export function createSubtask(taskId, data) {
  const allTasks = getAll(TASKS_KEY);
  const parent = allTasks.find(t => t.id === Number(taskId));
  if (!parent) return Promise.reject(new Error('Parent task not found'));

  const siblings = allTasks.filter(t => t.parent_task_id === Number(taskId));
  const maxPos = siblings.length ? Math.max(...siblings.map(t => t.position)) : -1;

  const subtask = {
    id: nextId(allTasks),
    title: data.title,
    description: null,
    completed: 0,
    priority: 4,
    due_date: null,
    project_id: parent.project_id,
    parent_task_id: Number(taskId),
    position: maxPos + 1,
    created_at: now(),
    completed_at: null,
  };

  setAll(TASKS_KEY, [...allTasks, subtask]);
  return resolve({ ...subtask });
}
