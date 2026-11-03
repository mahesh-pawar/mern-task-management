const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const csrfProtection = require('./middlewares/csrf.middleware');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const authRoutes = require('./modules/auth/auth.routes');
const taskRoutes = require('./modules/tasks/task.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');

const app = express();

// Needed for secure cookies behind a proxy (Render, Railway, Vercel rewrites)
if (env.isProduction) {
    app.set('trust proxy', 1);
}

// Security headers (X-Content-Type-Options, X-Frame-Options, HSTS, ...); also hides X-Powered-By
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(csrfProtection);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Unmatched routes
app.use(notFoundHandler);

// Must be last
app.use(errorHandler);

module.exports = app;
