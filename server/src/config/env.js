require('dotenv').config();

const REQUIRED_VARS = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 5000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
    SALT_ROUNDS: Number(process.env.SALT_ROUNDS) || 10,
    CLIENT_URL: process.env.CLIENT_URL,
};

env.isProduction = env.NODE_ENV === 'production';

module.exports = env;
