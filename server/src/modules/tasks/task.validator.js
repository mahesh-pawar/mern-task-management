const { body, param, query } = require('express-validator');

const { ERROR_CODES, msg } = require('../../middlewares/validate.middleware');
const { TASK_STATUS, TASK_PRIORITY } = require('./task.model');

const SORT_FIELDS = ['createdAt', 'dueDate'];
const SORT_ORDERS = ['asc', 'desc'];
const MAX_LIMIT = 50;

const statusRule = (field) =>
    field.isIn(TASK_STATUS).withMessage(msg(ERROR_CODES.invalidValue, `Status must be one of: ${TASK_STATUS.join(', ')}`));

const priorityRule = (field) =>
    field.isIn(TASK_PRIORITY).withMessage(msg(ERROR_CODES.invalidValue, `Priority must be one of: ${TASK_PRIORITY.join(', ')}`));

// Fields shared by create (POST) and update (PUT).
// Only fields listed here reach the service (controllers use matchedData),
// so a client-supplied userId is silently dropped.
const taskBodyRules = [
    body('title')
        .exists({ values: 'null' }).withMessage(msg(ERROR_CODES.required, 'Title is required'))
        .bail()
        .isString().withMessage(msg(ERROR_CODES.format, 'Title must be a string'))
        .bail()
        .trim()
        .notEmpty().withMessage(msg(ERROR_CODES.required, 'Title is required'))
        .bail()
        .isLength({ max: 200 }).withMessage(msg(ERROR_CODES.maxLength, 'Title must be at most 200 characters')),

    body('description')
        .optional({ values: 'null' })
        .isString().withMessage(msg(ERROR_CODES.format, 'Description must be a string'))
        .bail()
        .trim()
        .isLength({ max: 2000 }).withMessage(msg(ERROR_CODES.maxLength, 'Description must be at most 2000 characters')),

    statusRule(body('status').optional()),

    priorityRule(body('priority').optional()),

    // null or '' clears the due date
    body('dueDate')
        .optional()
        .custom((value) => value === null || value === '' || (typeof value === 'string' && !Number.isNaN(Date.parse(value))))
        .withMessage(msg(ERROR_CODES.format, 'Due date must be a valid ISO 8601 date'))
        .bail()
        .customSanitizer((value) => (value ? new Date(value) : null)),
];

const taskValidator = {
    idRules: [
        param('id').isMongoId().withMessage(msg(ERROR_CODES.format, 'Invalid task id')),
    ],

    createRules: taskBodyRules,

    updateRules: [
        param('id').isMongoId().withMessage(msg(ERROR_CODES.format, 'Invalid task id')),
        ...taskBodyRules,
    ],

    statusRules: [
        param('id').isMongoId().withMessage(msg(ERROR_CODES.format, 'Invalid task id')),
        statusRule(
            body('status').exists().withMessage(msg(ERROR_CODES.required, 'Status is required')).bail()
        ),
    ],

    listRules: [
        query('page')
            .optional()
            .isInt({ min: 1 }).withMessage(msg(ERROR_CODES.invalidValue, 'Page must be a positive integer')),

        query('limit')
            .optional()
            .isInt({ min: 1, max: MAX_LIMIT }).withMessage(msg(ERROR_CODES.invalidValue, `Limit must be between 1 and ${MAX_LIMIT}`)),

        statusRule(query('status').optional()),

        priorityRule(query('priority').optional()),

        query('search')
            .optional()
            .isString().withMessage(msg(ERROR_CODES.format, 'Search must be a string'))
            .bail()
            .isLength({ max: 100 }).withMessage(msg(ERROR_CODES.maxLength, 'Search must be at most 100 characters')),

        query('sortBy')
            .optional()
            .isIn(SORT_FIELDS).withMessage(msg(ERROR_CODES.invalidValue, `sortBy must be one of: ${SORT_FIELDS.join(', ')}`)),

        query('order')
            .optional()
            .isIn(SORT_ORDERS).withMessage(msg(ERROR_CODES.invalidValue, `order must be one of: ${SORT_ORDERS.join(', ')}`)),
    ],
};

module.exports = taskValidator;
