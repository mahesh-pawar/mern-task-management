const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            unique: true, // creates the unique index on email
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false, // never returned unless explicitly requested
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.__v;
                return ret;
            },
        },
    }
);

module.exports = mongoose.model('User', userSchema);
