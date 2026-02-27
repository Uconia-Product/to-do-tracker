import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import * as tasksApi from '../api/tasks';
import * as projectsApi from '../api/projects';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  projects: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => (p.id === action.payload.id ? action.payload : p)),
      };
    case 'DELETE_PROJECT':
      return { ...state, projects: state.projects.filter(p => p.id !== action.payload) };
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchProjects = useCallback(async () => {
    try {
      const projects = await projectsApi.getProjects();
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  }, []);

  const fetchTasks = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const tasks = await tasksApi.getTasks(params);
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const createTask = useCallback(async (data) => {
    const task = await tasksApi.createTask(data);
    dispatch({ type: 'ADD_TASK', payload: task });
    return task;
  }, []);

  const updateTask = useCallback(async (id, data) => {
    const task = await tasksApi.updateTask(id, data);
    dispatch({ type: 'UPDATE_TASK', payload: task });
    return task;
  }, []);

  const toggleTask = useCallback(async (id) => {
    const task = await tasksApi.toggleTask(id);
    dispatch({ type: 'UPDATE_TASK', payload: task });
    return task;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await tasksApi.deleteTask(id);
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const createProject = useCallback(async (data) => {
    const project = await projectsApi.createProject(data);
    dispatch({ type: 'ADD_PROJECT', payload: project });
    return project;
  }, []);

  const updateProject = useCallback(async (id, data) => {
    const project = await projectsApi.updateProject(id, data);
    dispatch({ type: 'UPDATE_PROJECT', payload: project });
    return project;
  }, []);

  const deleteProject = useCallback(async (id) => {
    await projectsApi.deleteProject(id);
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <TaskContext.Provider
      value={{
        ...state,
        fetchTasks,
        fetchProjects,
        createTask,
        updateTask,
        toggleTask,
        deleteTask,
        createProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => useContext(TaskContext);
