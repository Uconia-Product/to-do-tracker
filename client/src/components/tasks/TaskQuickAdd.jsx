import React, { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';

export default function TaskQuickAdd({ projectId, onAdded }) {
  const { createTask } = useTaskContext();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(4);
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || loading) return;
    setLoading(true);
    try {
      await createTask({
        title: title.trim(),
        priority,
        due_date: dueDate || null,
        project_id: projectId || null,
      });
      setTitle('');
      setPriority(4);
      setDueDate('');
      onAdded?.();
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 mt-2 transition-colors group w-full"
      >
        <span className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-indigo-500 flex items-center justify-center text-xs group-hover:text-indigo-500 transition-colors">
          +
        </span>
        Add task
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-3 space-y-3 mt-2 bg-white dark:bg-gray-800"
    >
      <input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); setTitle(''); } }}
        placeholder="Task name"
        className="w-full text-sm bg-transparent focus:outline-none font-medium placeholder-gray-300 dark:text-white dark:placeholder-gray-500"
      />
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
        <select
          value={priority}
          onChange={e => setPriority(Number(e.target.value))}
          className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        >
          <option value={1}>🔴 P1 — Urgent</option>
          <option value={2}>🟠 P2 — High</option>
          <option value={3}>🔵 P3 — Medium</option>
          <option value={4}>⚪ P4 — None</option>
        </select>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={!title.trim() || loading}
          className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setTitle(''); setPriority(4); setDueDate(''); }}
          className="px-4 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
