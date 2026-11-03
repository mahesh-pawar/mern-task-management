// Error with an HTTP status and a machine-readable code.
// Thrown from services/middlewares and formatted by error.middleware.js.
// Usage: throw new AppError(404, 'TASK_NOT_FOUND', 'Task not found');
class AppError extends Error {
    constructor(statusCode, code, message, errors) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.errors = errors; // optional field-level errors: [{ field, code, message }]
    }
}

module.exports = AppError;
