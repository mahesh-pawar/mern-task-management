const mongoose = require('mongoose');
const env = require('./env');

async function connectDatabase() {
    await mongoose.connect(env.MONGODB_URI);
    console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

module.exports = connectDatabase;
