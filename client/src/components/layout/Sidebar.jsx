import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTaskContext } from '../../context/TaskContext';
import DarkModeToggle from '../ui/DarkModeToggle';
import ProjectForm from '../projects/ProjectForm';
import Modal from '../ui/Modal';

const NAV_ITEMS = [
  { label: 'Inbox', path: '/inbox', icon: '📥' },
  { label: 'Today', path: '/today', icon: '📅' },
  { label: 'Upcoming', path: '/upcoming', icon: '📆' },
  { label: 'All Tasks', path: '/all', icon: '✅' },
];

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`
      }
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const { projects, deleteProject } = useTaskContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const userProjects = projects.filter(p => !p.is_inbox);

  const handleDeleteProject = async (e, project) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Delete "${project.name}"? All tasks inside will be removed.`)) return;
    await deleteProject(project.id);
    navigate('/inbox');
  };

  const handleEditProject = (e, project) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingProject(project);
    setModalOpen(true);
  };

  const openNewProject = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  return (
    <>
      <aside
        className={`${
          collapsed ? 'w-14' : 'w-60'
        } flex-shrink-0 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-200 overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-base truncate">
              Uconia Tasks
            </span>
          )}
          <div className="flex items-center gap-0.5 ml-auto">
            <DarkModeToggle />
            <button
              onClick={() => setCollapsed(c => !c)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 transition-colors text-sm"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {collapsed
            ? NAV_ITEMS.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  className={({ isActive }) =>
                    `flex items-center justify-center p-2 rounded-lg text-lg ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-900/40'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  {item.icon}
                </NavLink>
              ))
            : NAV_ITEMS.map(item => (
                <NavItem key={item.path} to={item.path} icon={item.icon} label={item.label} />
              ))}

          {/* Projects section */}
          {!collapsed && (
            <div className="mt-4">
              <div className="flex items-center justify-between px-3 py-1 mb-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Projects
                </span>
                <button
                  onClick={openNewProject}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-lg leading-none transition-colors"
                  title="New project"
                >
                  +
                </button>
              </div>

              {userProjects.length === 0 && (
                <p className="text-xs text-gray-400 px-3 py-1">No projects yet</p>
              )}

              <div className="space-y-0.5">
                {userProjects.map(project => (
                  <NavLink
                    key={project.id}
                    to={`/project/${project.id}`}
                    className={({ isActive }) =>
                      `group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="flex-1 truncate">{project.name}</span>
                    <div className="hidden group-hover:flex items-center gap-0.5">
                      <button
                        onClick={e => handleEditProject(e, project)}
                        className="p-0.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={e => handleDeleteProject(e, project)}
                        className="p-0.5 rounded text-gray-400 hover:text-red-500 text-xs"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </nav>
      </aside>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProject(null); }}
        title={editingProject ? 'Edit project' : 'New project'}
      >
        <ProjectForm
          project={editingProject}
          onClose={() => { setModalOpen(false); setEditingProject(null); }}
        />
      </Modal>
    </>
  );
}
