const dashboardService = require('./dashboard.service');
const { sendSuccess } = require('../../utils/apiResponse');

const dashboardController = {
    // GET /api/dashboard/stats
    async getStats(req, res) {
        const stats = await dashboardService.getStats(req.userId);
        sendSuccess(res, 200, 'Dashboard stats fetched successfully', { stats });
    },
};

module.exports = dashboardController;
