import React, { useState } from 'react';
import * as tasksApi from '../../api/tasks';

export default function SubtaskList({ taskId, subtasks: initialSubtasks }) {
  const [subtasks, setSubtasks] = useState(initialSubtasks || []);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleToggle = async (id) => {
    const updated = await tasksApi.toggleTask(id);
    setSubtasks(prev => prev.map(s => (s.id === id ? updated : s)));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || loading) return;
    setLoading(true);
    try {
      const subtask = await tasksApi.createSubtask(taskId, { title: newTitle.trim() });
      setSubtasks(prev => [...prev, subtask]);
      setNewTitle('');
      setAdding(false);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = subtasks.filter(s => s.completed).length;

  return (
    <div className="space-y-1 pt-1">
      {subtasks.length > 0 && (
        <div className="text-xs text-gray-400 mb-1.5">
          {completedCount}/{subtasks.length} completed
        </div>
      )}

      {subtasks.map(subtask => (
        <div key={subtask.id} className="flex items-center gap-2 py-0.5">
          <button
            onClick={() => handleToggle(subtask.id)}
            className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              subtask.completed
                ? 'bg-indigo-400 border-indigo-400'
                : 'border-gray-300 hover:border-indigo-400'
            }`}
          >
            {subtask.completed && (
              <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <span
            className={`text-xs ${
              subtask.completed
                ? 'line-through text-gray-400'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            {subtask.title}
          </span>
        </div>
      ))}

      {adding ? (
        <form onSubmit={handleAdd} className="flex items-center gap-2 pt-1">
          <input
            autoFocus
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') { setAdding(false); setNewTitle(''); }
            }}
            placeholder="Subtask name..."
            className="text-xs flex-1 border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:border-indigo-400 py-0.5 dark:text-gray-200"
          />
          <button
            type="submit"
            disabled={!newTitle.trim() || loading}
            className="text-xs text-indigo-600 font-medium hover:text-indigo-700 disabled:opacity-50"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => { setAdding(false); setNewTitle(''); }}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="text-xs text-gray-400 hover:text-indigo-500 flex items-center gap-1 pt-0.5 transition-colors"
        >
          + Add subtask
        </button>
      )}
    </div>
  );
}
