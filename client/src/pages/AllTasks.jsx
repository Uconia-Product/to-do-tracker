import React, { useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskList from '../components/tasks/TaskList';

export default function AllTasks() {
  const { tasks, fetchTasks, loading } = useTaskContext();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">✅ All Tasks</h1>
        <p className="text-sm text-gray-400 mt-0.5">{tasks.length} total</p>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm animate-pulse">Loading...</div>
      ) : (
        <TaskList tasks={tasks} />
      )}
    </div>
  );
}
