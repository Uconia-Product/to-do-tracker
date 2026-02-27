import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const getTasks = (params) => api.get('/tasks', { params }).then(r => r.data);
export const createTask = (data) => api.post('/tasks', data).then(r => r.data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data).then(r => r.data);
export const toggleTask = (id) => api.patch(`/tasks/${id}/toggle`).then(r => r.data);
export const reorderTask = (id, position) =>
  api.patch(`/tasks/${id}/reorder`, { position }).then(r => r.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then(r => r.data);
export const getSubtasks = (taskId) => api.get(`/tasks/${taskId}/subtasks`).then(r => r.data);
export const createSubtask = (taskId, data) =>
  api.post(`/tasks/${taskId}/subtasks`, data).then(r => r.data);
