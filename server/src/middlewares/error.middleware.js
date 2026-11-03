const AppError = require('../utils/AppError');

// Converts known library errors into AppErrors so the client never sees raw internals.
// Returns null for anything unexpected.
function normalizeError(err) {
    if (err instanceof AppError) {
        return err;
    }

    // Malformed JSON body
    if (err.type === 'entity.parse.failed') {
        return new AppError(400, 'INVALID_JSON', 'Request body contains invalid JSON');
    }

    // Invalid ObjectId reaching a Mongoose query
    if (err.name === 'CastError') {
        return new AppError(400, 'INVALID_ID', `Invalid value for ${err.path}`);
    }

    // Unique index violation (e.g. same email registered by two parallel requests)
    if (err.code === 11000) {
        return new AppError(409, 'DUPLICATE_KEY', 'A record with this value already exists');
    }

    return null;
}

function notFoundHandler(req, res) {
    res.status(404).json({ status: 'error', code: 'NOT_FOUND', message: 'Route not found' });
}

// Must be registered last
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    const appError = normalizeError(err);

    if (!appError) {
        // Unexpected error: log the details, return a generic message
        console.error(err);
        return res.status(500).json({
            status: 'error',
            code: 'INTERNAL_ERROR',
            message: 'Something went wrong',
        });
    }

    const body = {
        status: 'error',
        code: appError.code,
        message: appError.message,
    };
    if (appError.errors) {
        body.errors = appError.errors;
    }

    res.status(appError.statusCode).json(body);
}

module.exports = { notFoundHandler, errorHandler };
