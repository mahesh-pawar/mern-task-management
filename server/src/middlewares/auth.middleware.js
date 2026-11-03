const jwt = require('jsonwebtoken');

const env = require('../config/env');
const AppError = require('../utils/AppError');
const { AUTH_COOKIE_NAME } = require('../utils/cookie');

const authMiddleware = {
    // Reads the JWT from the HTTP-only cookie and exposes the owner id as req.userId.
    // Downstream code must use req.userId and never a user id sent by the client.
    requireAuth(req, res, next) {
        const token = req.cookies?.[AUTH_COOKIE_NAME];
        if (!token) {
            return next(new AppError(401, 'UNAUTHORIZED', 'Authentication required'));
        }

        try {
            const payload = jwt.verify(token, env.JWT_SECRET);
            req.userId = payload.userId;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return next(new AppError(401, 'TOKEN_EXPIRED', 'Your session has expired. Please log in again'));
            }
            next(new AppError(401, 'INVALID_TOKEN', 'Invalid authentication token'));
        }
    },
};

module.exports = authMiddleware;
