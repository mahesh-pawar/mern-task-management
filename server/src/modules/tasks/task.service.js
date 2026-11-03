const AppError = require('../../utils/AppError');
const escapeRegex = require('../../utils/escapeRegex');
const { Task } = require('./task.model');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

// Every query below is scoped by userId. A task owned by someone else is
// reported as "not found" so its existence isn't leaked.
const taskNotFound = () => new AppError(404, 'TASK_NOT_FOUND', 'Task not found');

const updateOptions = { returnDocument: 'after', runValidators: true };

const taskService = {
    async create(userId, data) {
        return Task.create({ ...data, userId });
    },

    // query values are already validated by task.validator listRules
    async list(userId, query) {
        const page = Number(query.page) || DEFAULT_PAGE;
        const limit = Number(query.limit) || DEFAULT_LIMIT;
        const sortBy = query.sortBy || 'createdAt';
        const order = query.order === 'asc' ? 1 : -1;

        const filter = { userId };
        if (query.status) {
            filter.status = query.status;
        }
        if (query.priority) {
            filter.priority = query.priority;
        }
        if (query.search?.trim()) {
            filter.title = { $regex: escapeRegex(query.search.trim()), $options: 'i' };
        }

        // _id as a tie-breaker keeps pagination stable when sort values are equal
        const sort = { [sortBy]: order, _id: order };

        const [tasks, total] = await Promise.all([
            Task.find(filter)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit),
            Task.countDocuments(filter),
        ]);

        return {
            tasks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async getById(userId, taskId) {
        const task = await Task.findOne({ _id: taskId, userId });
        if (!task) {
            throw taskNotFound();
        }

        return task;
    },

    async update(userId, taskId, data) {
        const task = await Task.findOneAndUpdate({ _id: taskId, userId }, { $set: data }, updateOptions);
        if (!task) {
            throw taskNotFound();
        }

        return task;
    },

    async updateStatus(userId, taskId, status) {
        const task = await Task.findOneAndUpdate({ _id: taskId, userId }, { $set: { status } }, updateOptions);
        if (!task) {
            throw taskNotFound();
        }

        return task;
    },

    async delete(userId, taskId) {
        const task = await Task.findOneAndDelete({ _id: taskId, userId });
        if (!task) {
            throw taskNotFound();
        }
    },
};

module.exports = taskService;
