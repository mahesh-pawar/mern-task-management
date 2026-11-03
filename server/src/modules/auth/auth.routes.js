const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const authValidator = require('./auth.validator');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { validate } = require('../../middlewares/validate.middleware');

router.post('/register', validate(authValidator.registerRules), authController.register);
router.post('/login', validate(authValidator.loginRules), authController.login);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.me);

module.exports = router;
