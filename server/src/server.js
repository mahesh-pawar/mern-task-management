const env = require('./config/env');
const connectDatabase = require('./config/database');
const app = require('./app');

async function start() {
    try {
        await connectDatabase();

        app.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT} (${env.NODE_ENV})`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

start();
