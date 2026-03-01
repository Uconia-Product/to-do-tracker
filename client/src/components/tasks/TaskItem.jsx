import React, { useState, useRef, useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import PriorityFlag from '../ui/PriorityFlag';
import DueDateBadge from '../ui/DueDateBadge';
import SubtaskList from './SubtaskList';

const PRIORITY_LEFT_BORDER = {
  1: 'border-l-red-500',
  2: 'border-l-orange-400',
  3: 'border-l-blue-500',
  4: 'border-l-transparent',
};

export default function TaskItem({ task, provided }) {
  const { toggleTask, updateTask, deleteTask } = useTaskContext();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.due_date || '');
  const [expanded, setExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    setTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.due_date || '');
  }, [task]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const handleToggle = async () => {
    await toggleTask(task.id);
  };

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) { setTitle(task.title); setEditing(false); return; }
    await updateTask(task.id, {
      title: trimmed,
      priority: editPriority,
      due_date: editDueDate || null,
    });
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') { setTitle(task.title); setEditing(false); }
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
  };

  const borderColor = PRIORITY_LEFT_BORDER[task.priority] || 'border-l-transparent';
  const subtaskCount = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;

  return (
    <div
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
      className={`border-l-2 ${borderColor} bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 transition-shadow hover:shadow-sm ${
        task.completed ? 'opacity-55' : ''
      }`}
    >
      <div
        className="flex items-start gap-2.5 px-3 py-2.5"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Drag handle */}
        {provided && (
          <div
            {...provided.dragHandleProps}
            className="mt-1 text-gray-300 dark:text-gray-600 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity select-none text-sm"
          >
            ⠿
          </div>
        )}

        {/* Checkbox */}
        <button
          onClick={handleToggle}
          style={{ width: 18, height: 18, marginTop: 2, flexShrink: 0 }}
          className={`rounded-full border-2 flex items-center justify-center transition-all checkbox-pop ${
            task.completed
              ? 'bg-green-400 border-green-400'
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {task.completed && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2">
              <input
                ref={inputRef}
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="w-full text-sm bg-transparent border-b-2 border-indigo-400 focus:outline-none pb-0.5 dark:text-white"
              />
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={editDueDate}
                  onChange={e => setEditDueDate(e.target.value)}
                  className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
                <select
                  value={editPriority}
                  onChange={e => setEditPriority(Number(e.target.value))}
                  className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                >
                  <option value={1}>🔴 P1 — Urgent</option>
                  <option value={2}>🟠 P2 — High</option>
                  <option value={3}>🔵 P3 — Medium</option>
                  <option value={4}>⚪ P4 — None</option>
                </select>
                <button
                  type="button"
                  onMouseDown={e => { e.preventDefault(); handleSave(); }}
                  className="text-xs text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  onClick={() => !task.completed && setEditing(true)}
                  className={`text-sm cursor-pointer select-none ${
                    task.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-800 dark:text-gray-100 hover:text-indigo-700 dark:hover:text-indigo-300'
                  }`}
                >
                  {task.title}
                </span>
                <PriorityFlag priority={task.priority} />
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <DueDateBadge dueDate={task.due_date} />
                {subtaskCount > 0 && (
                  <button
                    onClick={() => setExpanded(e => !e)}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1"
                  >
                    <span>{expanded ? '▾' : '▸'}</span>
                    <span>{completedSubtasks}/{subtaskCount}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {showActions && !editing && (
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="p-1 rounded text-gray-300 hover:text-gray-600 dark:hover:text-gray-200 text-sm transition-colors"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => setExpanded(e => !e)}
              className="p-1 rounded text-gray-300 hover:text-gray-600 dark:hover:text-gray-200 text-sm transition-colors"
              title="Add subtask"
            >
              ➕
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded text-gray-300 hover:text-red-500 text-sm transition-colors"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Subtasks panel */}
      {expanded && (
        <div className="px-10 pb-3 border-t border-gray-50 dark:border-gray-700 pt-2">
          <SubtaskList taskId={task.id} subtasks={task.subtasks || []} />
        </div>
      )}
    </div>
  );
}
