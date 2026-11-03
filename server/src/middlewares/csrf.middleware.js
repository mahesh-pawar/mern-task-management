const env = require('../config/env');
const AppError = require('../utils/AppError');

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

// Second layer of CSRF protection on top of SameSite=Lax cookies:
// state-changing requests coming from a browser must originate from our client.
// Browsers always send Origin on POST/PUT/PATCH/DELETE, so a request without it
// is a non-browser client (curl, Postman) that can't be tricked into sending the cookie.
function csrfProtection(req, res, next) {
    if (SAFE_METHODS.includes(req.method)) {
        return next();
    }

    const origin = req.headers.origin;
    if (!origin || origin === env.CLIENT_URL) {
        return next();
    }

    next(new AppError(403, 'CSRF_ORIGIN_MISMATCH', 'Request origin is not allowed'));
}

module.exports = csrfProtection;
