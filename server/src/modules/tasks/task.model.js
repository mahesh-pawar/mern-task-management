const mongoose = require('mongoose');

const TASK_STATUS = ['todo', 'in_progress', 'completed'];
const TASK_PRIORITY = ['low', 'medium', 'high'];

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: '',
        },
        status: {
            type: String,
            enum: TASK_STATUS,
            default: 'todo',
        },
        priority: {
            type: String,
            enum: TASK_PRIORITY,
            default: 'medium',
        },
        dueDate: {
            type: Date,
            default: null,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Default list view: a user's tasks, optionally filtered by status, newest first.
taskSchema.index({ userId: 1, status: 1, createdAt: -1 });
// Sorting by due date and the overdue count on the dashboard.
taskSchema.index({ userId: 1, dueDate: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = { Task, TASK_STATUS, TASK_PRIORITY };
