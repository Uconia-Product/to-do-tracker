import React, { useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskList from '../components/tasks/TaskList';
import TaskQuickAdd from '../components/tasks/TaskQuickAdd';

export default function Inbox() {
  const { tasks, projects, fetchTasks, loading } = useTaskContext();
  const inbox = projects.find(p => p.is_inbox);

  useEffect(() => {
    if (inbox) fetchTasks({ project_id: inbox.id });
  }, [inbox?.id, fetchTasks]);

  const refresh = () => { if (inbox) fetchTasks({ project_id: inbox.id }); };
  const activeCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          📥 Inbox
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {activeCount} task{activeCount !== 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm animate-pulse">Loading...</div>
      ) : (
        <>
          <TaskList tasks={tasks} onReorder={refresh} />
          <TaskQuickAdd projectId={inbox?.id} onAdded={refresh} />
        </>
      )}
    </div>
  );
}
