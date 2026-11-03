const { body } = require('express-validator');

const { ERROR_CODES, msg } = require('../../middlewares/validate.middleware');

const emailRule = () =>
    body('email')
        .trim()
        .notEmpty().withMessage(msg(ERROR_CODES.required, 'Email is required'))
        .bail()
        .isEmail().withMessage(msg(ERROR_CODES.format, 'Please provide a valid email address'))
        .bail()
        .toLowerCase();

const authValidator = {
    registerRules: [
        body('name')
            .trim()
            .notEmpty().withMessage(msg(ERROR_CODES.required, 'Name is required'))
            .bail()
            .isLength({ max: 100 }).withMessage(msg(ERROR_CODES.maxLength, 'Name must be at most 100 characters')),

        emailRule(),

        body('password')
            .notEmpty().withMessage(msg(ERROR_CODES.required, 'Password is required'))
            .bail()
            .isLength({ min: 8 }).withMessage(msg(ERROR_CODES.minLength, 'Password must be at least 8 characters long'))
            .bail()
            // bcrypt only uses the first 72 bytes
            .isLength({ max: 72 }).withMessage(msg(ERROR_CODES.maxLength, 'Password must be at most 72 characters long')),
    ],

    loginRules: [
        emailRule(),

        body('password')
            .notEmpty().withMessage(msg(ERROR_CODES.required, 'Password is required')),
    ],
};

module.exports = authValidator;
