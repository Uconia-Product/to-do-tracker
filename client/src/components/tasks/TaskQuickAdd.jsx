import React, { useState } from 'react';
import { format } from 'date-fns';
import { useTaskContext } from '../../context/TaskContext';
import { parseSmartDate, parseSmartPriority } from '../../utils/smartInput';

export default function TaskQuickAdd({ projectId, onAdded, defaultDate }) {
  const { createTask } = useTaskContext();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(4);
  const [loading, setLoading] = useState(false);
  const [dateDetected, setDateDetected] = useState(false);
  const [priorityDetected, setPriorityDetected] = useState(false);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [dueDate, setDueDate] = useState(defaultDate || todayStr);

  const handleOpen = () => {
    setDueDate(defaultDate || format(new Date(), 'yyyy-MM-dd'));
    setPriority(4);
    setTitle('');
    setDateDetected(false);
    setPriorityDetected(false);
    setOpen(true);
  };

  // -------------------------------------------------------------------------
  // As the user types, scan for day names and priority keywords and update
  // the date / priority fields live. We DON'T strip the keywords from the
  // title while typing — they're stripped only on submit so the user can
  // see and correct what they typed.
  // -------------------------------------------------------------------------
  const handleTitleChange = (e) => {
    const raw = e.target.value;
    setTitle(raw);

    const detectedDate = parseSmartDate(raw);
    if (detectedDate) {
      setDueDate(detectedDate);
      setDateDetected(true);
    } else {
      // Revert to the default date when the user clears the day name
      setDueDate(defaultDate || format(new Date(), 'yyyy-MM-dd'));
      setDateDetected(false);
    }

    const detectedPriority = parseSmartPriority(raw);
    if (detectedPriority) {
      setPriority(detectedPriority);
      setPriorityDetected(true);
    } else {
      setPriorityDetected(false);
    }
  };

  // -------------------------------------------------------------------------
  // On submit, strip the matched keywords from the saved title so the stored
  // task name is clean (e.g. "Meeting Monday P1" → "Meeting").
  // -------------------------------------------------------------------------
  const cleanTitle = (raw) => {
    let cleaned = raw;

    // Strip priority keyword (p1–p4, whole word, case-insensitive)
    cleaned = cleaned.replace(/\bp[1-4]\b/gi, '');

    // Strip day / relative-date keywords (whole word, case-insensitive)
    const dayPattern =
      /\b(today|tomorrow|tmr|tmrw|monday|mon|tuesday|tue|tues|wednesday|wed|thursday|thu|thur|thurs|friday|fri|saturday|sat|sunday|sun)\b/gi;
    cleaned = cleaned.replace(dayPattern, '');

    // Collapse extra whitespace
    return cleaned.replace(/\s+/g, ' ').trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawTitle = title.trim();
    if (!rawTitle || loading) return;

    const finalTitle = cleanTitle(rawTitle) || rawTitle; // fallback to raw if cleaning empties it

    setLoading(true);
    try {
      await createTask({
        title: finalTitle,
        priority,
        due_date: dueDate || null,
        project_id: projectId || null,
      });
      setTitle('');
      setPriority(4);
      setDueDate(defaultDate || format(new Date(), 'yyyy-MM-dd'));
      setDateDetected(false);
      setPriorityDetected(false);
      setOpen(false);
      onAdded?.();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setTitle('');
    setPriority(4);
    setDueDate(defaultDate || format(new Date(), 'yyyy-MM-dd'));
    setDateDetected(false);
    setPriorityDetected(false);
  };

  // -------------------------------------------------------------------------
  // Closed state — just the "+ Add task" trigger
  // -------------------------------------------------------------------------
  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 mt-2 transition-colors group w-full"
      >
        <span className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-indigo-500 flex items-center justify-center text-xs group-hover:text-indigo-500 transition-colors">
          +
        </span>
        Add task
      </button>
    );
  }

  // -------------------------------------------------------------------------
  // Open state — the quick-add form
  // -------------------------------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-3 space-y-3 mt-2 bg-white dark:bg-gray-800"
    >
      <input
        autoFocus
        value={title}
        onChange={handleTitleChange}
        onKeyDown={e => { if (e.key === 'Escape') handleCancel(); }}
        placeholder="Task name — type Monday, P1, etc."
        className="w-full text-sm bg-transparent focus:outline-none font-medium placeholder-gray-300 dark:text-white dark:placeholder-gray-500"
      />

      {/* Smart-detect hint chips */}
      {(dateDetected || priorityDetected) && (
        <div className="flex gap-1.5 flex-wrap">
          {dateDetected && (
            <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 rounded-full px-2 py-0.5">
              📅 Date detected
            </span>
          )}
          {priorityDetected && (
            <span className="inline-flex items-center gap-1 text-xs bg-orange-50 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 border border-orange-200 dark:border-orange-700 rounded-full px-2 py-0.5">
              🚩 Priority detected
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="date"
          value={dueDate}
          onChange={e => { setDueDate(e.target.value); setDateDetected(false); }}
          className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
        <select
          value={priority}
          onChange={e => { setPriority(Number(e.target.value)); setPriorityDetected(false); }}
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
          onClick={handleCancel}
          className="px-4 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
