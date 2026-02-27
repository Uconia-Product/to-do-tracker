import React, { useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskList from '../components/tasks/TaskList';

export default function Today() {
  const { tasks, fetchTasks, loading } = useTaskContext();

  useEffect(() => {
    fetchTasks({ filter: 'today' });
  }, [fetchTasks]);

  const activeCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📅 Today</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {activeCount} task{activeCount !== 1 ? 's' : ''} due today
        </p>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm animate-pulse">Loading...</div>
      ) : activeCount === 0 && tasks.filter(t => t.completed).length === 0 ? (
        <div className="text-center py-16 select-none">
          <div className="text-5xl mb-3">🎉</div>
          <p className="text-gray-400 text-sm">Nothing due today — enjoy your day!</p>
        </div>
      ) : (
        <TaskList tasks={tasks} />
      )}
    </div>
  );
}
