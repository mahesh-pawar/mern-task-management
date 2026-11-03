const { validationResult } = require('express-validator');

const AppError = require('../utils/AppError');

const ERROR_CODES = {
    required: 'FIELD_REQUIRED',
    format: 'INVALID_FORMAT',
    minLength: 'TOO_SHORT',
    maxLength: 'TOO_LONG',
    invalidValue: 'INVALID_VALUE',
    notAllowed: 'FIELD_NOT_ALLOWED',
};

// Builds an error message object so every rule reports { code, message }.
const msg = (code, message) => ({ code, message });

function handleValidationErrors(req, res, next) {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }

    const errors = result.array().map((err) => ({
        field: err.path,
        code: err.msg.code || ERROR_CODES.invalidValue,
        message: err.msg.message || String(err.msg),
    }));

    next(new AppError(400, 'VALIDATION_ERROR', 'The request contains invalid or missing fields', errors));
}

// Usage: router.post('/', validate(taskValidator.createRules), controller.create)
function validate(rules) {
    return [...rules, handleValidationErrors];
}

module.exports = { validate, ERROR_CODES, msg };
