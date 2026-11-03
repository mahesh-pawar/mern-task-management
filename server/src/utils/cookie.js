const env = require('../config/env');

const AUTH_COOKIE_NAME = 'token';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// The client talks to the API through a same-site proxy (Vite in dev,
// Vercel rewrites in production), so SameSite=Lax is enough and the
// browser won't attach the cookie to cross-site POST/PUT/DELETE requests.
const authCookieOptions = {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/',
};

const cookie = {
    AUTH_COOKIE_NAME,

    setAuthCookie(res, token) {
        res.cookie(AUTH_COOKIE_NAME, token, { ...authCookieOptions, maxAge: ONE_DAY_MS });
    },

    clearAuthCookie(res) {
        res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions);
    },
};

module.exports = cookie;
