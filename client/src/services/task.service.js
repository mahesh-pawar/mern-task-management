import api from './api';

// Drops empty filters so the URL stays clean: ?page=1&status=todo
const cleanParams = (params) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== '' && value != null));

const taskService = {
  async list(params = {}) {
    const { data } = await api.get('/tasks', { params: cleanParams(params) });
    return data; // { tasks, pagination }
  },

  async getById(id) {
    const { data } = await api.get(`/tasks/${id}`);
    return data.task;
  },

  async create(task) {
    const { data } = await api.post('/tasks', task);
    return data.task;
  },

  async update(id, task) {
    const { data } = await api.put(`/tasks/${id}`, task);
    return data.task;
  },

  async updateStatus(id, status) {
    const { data } = await api.patch(`/tasks/${id}/status`, { status });
    return data.task;
  },

  async remove(id) {
    await api.delete(`/tasks/${id}`);
  },
};

export default taskService;
