const mongoose = require('mongoose');

const { Task } = require('../tasks/task.model');

const countWhere = (condition) => ({ $sum: { $cond: [condition, 1, 0] } });

const dashboardService = {
    // All counts come from a single aggregation over the user's own tasks.
    async getStats(userId) {
        const now = new Date();

        const [stats] = await Task.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: countWhere({ $eq: ['$status', 'todo'] }),
                    inProgress: countWhere({ $eq: ['$status', 'in_progress'] }),
                    completed: countWhere({ $eq: ['$status', 'completed'] }),
                    // Not completed and the due date has passed ($gt null skips tasks without a due date)
                    overdue: countWhere({
                        $and: [
                            { $ne: ['$status', 'completed'] },
                            { $gt: ['$dueDate', null] },
                            { $lt: ['$dueDate', now] },
                        ],
                    }),
                },
            },
        ]);

        const { total = 0, pending = 0, inProgress = 0, completed = 0, overdue = 0 } = stats || {};

        return {
            total,
            pending,
            inProgress,
            completed,
            overdue,
            completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
        };
    },
};

module.exports = dashboardService;
