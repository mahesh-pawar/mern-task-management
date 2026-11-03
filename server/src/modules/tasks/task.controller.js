const { matchedData } = require('express-validator');

const taskService = require('./task.service');
const { sendSuccess } = require('../../utils/apiResponse');

// Only validated body fields; anything else (e.g. userId) is dropped
const bodyData = (req) => matchedData(req, { locations: ['body'] });

const taskController = {
    // POST /api/tasks
    async create(req, res) {
        const task = await taskService.create(req.userId, bodyData(req));
        sendSuccess(res, 201, 'Task created successfully', { task });
    },

    // GET /api/tasks?page&limit&status&priority&search&sortBy&order
    async list(req, res) {
        const result = await taskService.list(req.userId, req.query);
        sendSuccess(res, 200, 'Tasks fetched successfully', result);
    },

    // GET /api/tasks/:id
    async getById(req, res) {
        const task = await taskService.getById(req.userId, req.params.id);
        sendSuccess(res, 200, 'Task fetched successfully', { task });
    },

    // PUT /api/tasks/:id
    async update(req, res) {
        const task = await taskService.update(req.userId, req.params.id, bodyData(req));
        sendSuccess(res, 200, 'Task updated successfully', { task });
    },

    // PATCH /api/tasks/:id/status
    async updateStatus(req, res) {
        const task = await taskService.updateStatus(req.userId, req.params.id, req.body.status);
        sendSuccess(res, 200, 'Task status updated successfully', { task });
    },

    // DELETE /api/tasks/:id
    async delete(req, res) {
        await taskService.delete(req.userId, req.params.id);
        sendSuccess(res, 200, 'Task deleted successfully');
    },
};

module.exports = taskController;
