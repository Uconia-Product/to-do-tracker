import React, { useEffect } from 'react';
import { format, addDays, startOfDay, parseISO, isToday } from 'date-fns';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from '../components/tasks/TaskItem';
import TaskQuickAdd from '../components/tasks/TaskQuickAdd';

export default function Upcoming() {
  const { tasks, fetchTasks, loading } = useTaskContext();

  useEffect(() => {
    fetchTasks({ filter: 'upcoming' });
  }, [fetchTasks]);

  const refresh = () => fetchTasks({ filter: 'upcoming' });

  // Next 7 days starting from today
  const days = Array.from({ length: 7 }, (_, i) => addDays(startOfDay(new Date()), i));

  // Group tasks by due-date string (yyyy-MM-dd)
  const tasksByDate = days.reduce((acc, day) => {
    const key = format(day, 'yyyy-MM-dd');
    acc[key] = tasks.filter(t => {
      if (!t.due_date) return false;
      return format(parseISO(t.due_date), 'yyyy-MM-dd') === key;
    });
    return acc;
  }, {});

  const activeCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📆 Upcoming</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Next 7 days · {activeCount} task{activeCount !== 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm animate-pulse">Loading...</div>
      ) : (
        /* 7-column grid — fills the full available width, no scrollbar */
        <div className="grid grid-cols-7 gap-3 w-full">
          {days.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayTasks = tasksByDate[dateKey] || [];
            const activeDayTasks = dayTasks.filter(t => !t.completed);
            const completedDayTasks = dayTasks.filter(t => t.completed);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={dateKey}
                className={`min-w-0 rounded-xl border flex flex-col ${
                  isCurrentDay
                    ? 'border-indigo-200 dark:border-indigo-700 bg-indigo-50/60 dark:bg-indigo-950/30'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                } p-3`}
              >
                {/* Day header */}
                <div className="mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                  <p className={`text-xs font-bold uppercase tracking-wider truncate ${
                    isCurrentDay ? 'text-indigo-500' : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {isCurrentDay ? 'Today' : format(day, 'EEE')}
                  </p>
                  <p className={`text-sm font-bold leading-tight ${
                    isCurrentDay
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-800 dark:text-white'
                  }`}>
                    {format(day, 'MMM d')}
                  </p>
                  {dayTasks.length > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {activeDayTasks.length} task{activeDayTasks.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Active tasks */}
                <div className="flex-1 space-y-2">
                  {activeDayTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}

                  {/* Completed tasks (dimmed) */}
                  {completedDayTasks.length > 0 && (
                    <div className="space-y-2 opacity-50 mt-1">
                      {completedDayTasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </div>
                  )}

                  {/* Empty placeholder so the column doesn't collapse */}
                  {dayTasks.length === 0 && (
                    <p className="text-xs text-gray-300 dark:text-gray-600 py-3 text-center select-none">
                      No tasks
                    </p>
                  )}
                </div>

                {/* Per-column Add task — date is pre-filled to this day */}
                <TaskQuickAdd defaultDate={dateKey} onAdded={refresh} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
