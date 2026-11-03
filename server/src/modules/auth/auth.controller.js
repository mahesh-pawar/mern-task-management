const authService = require('./auth.service');
const cookie = require('../../utils/cookie');
const { sendSuccess } = require('../../utils/apiResponse');

const authController = {
    // POST /api/auth/register
    async register(req, res) {
        const { name, email, password } = req.body;
        const { user, token } = await authService.register({ name, email, password });

        cookie.setAuthCookie(res, token);
        sendSuccess(res, 201, 'User registered successfully', { user });
    },

    // POST /api/auth/login
    async login(req, res) {
        const { email, password } = req.body;
        const { user, token } = await authService.login({ email, password });

        cookie.setAuthCookie(res, token);
        sendSuccess(res, 200, 'User logged in successfully', { user });
    },

    // POST /api/auth/logout
    logout(req, res) {
        cookie.clearAuthCookie(res);
        sendSuccess(res, 200, 'User logged out successfully');
    },

    // GET /api/auth/me — used by the client to restore the session after a refresh
    async me(req, res) {
        const user = await authService.getCurrentUser(req.userId);
        sendSuccess(res, 200, 'Authenticated user', { user });
    },
};

module.exports = authController;
