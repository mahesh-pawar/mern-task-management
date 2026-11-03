const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const env = require('../../config/env');
const AppError = require('../../utils/AppError');
const User = require('./user.model');

function signToken(userId) {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

const authService = {
    async register({ name, email, password }) {
        const existingUser = await User.exists({ email });
        if (existingUser) {
            throw new AppError(409, 'EMAIL_ALREADY_EXISTS', 'An account with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, env.SALT_ROUNDS);
        const user = await User.create({ name, email, password: hashedPassword });

        return { user, token: signToken(user.id) };
    },

    async login({ email, password }) {
        const user = await User.findOne({ email }).select('+password');

        // Same response for unknown email and wrong password, so accounts can't be enumerated
        const passwordMatched = user ? await bcrypt.compare(password, user.password) : false;
        if (!passwordMatched) {
            throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
        }

        return { user, token: signToken(user.id) };
    },

    async getCurrentUser(userId) {
        const user = await User.findById(userId);
        if (!user) {
            // Token is valid but the account no longer exists
            throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
        }

        return user;
    },
};

module.exports = authService;
