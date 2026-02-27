import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import TaskList from '../components/tasks/TaskList';
import TaskQuickAdd from '../components/tasks/TaskQuickAdd';

export default function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, projects, fetchTasks, loading } = useTaskContext();
  const project = projects.find(p => p.id === Number(id));

  useEffect(() => {
    if (id) fetchTasks({ project_id: id });
  }, [id, fetchTasks]);

  useEffect(() => {
    // Redirect to inbox if project was deleted
    if (!loading && projects.length > 0 && !project) {
      navigate('/inbox');
    }
  }, [project, projects, loading, navigate]);

  if (!project) return null;

  const refresh = () => fetchTasks({ project_id: id });
  const activeCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span
          className="w-3.5 h-3.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: project.color }}
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {activeCount} task{activeCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm animate-pulse">Loading...</div>
      ) : (
        <>
          <TaskList tasks={tasks} onReorder={refresh} />
          <TaskQuickAdd projectId={Number(id)} onAdded={refresh} />
        </>
      )}
    </div>
  );
}
