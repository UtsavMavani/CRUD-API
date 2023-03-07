const mongoose = require('mongoose');
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        trim: true,
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        trim: true,
    },
    gender: {
        type: String,
        required: [true, "Please enter your gender"],
        trim: true,
        lowercase: true,
        enum: ['male', 'female'],
    },
    interest: [
        {
            type: String,
            trim: true,
            lowercase: true,
        }
    ],
    image: {
        type: String,
        trim: true
    },
}, {timestamps: true});

module.exports = mongoose.model("user", userSchema);