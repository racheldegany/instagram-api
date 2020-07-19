const mongoose = require('mongoose');

const User = new mongoose.model ('User', {
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true  
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: String,
    bio: {
        type: String,
        maxlength: 300
        
    },
    createdAt: {
        type: Date,
        default: () => {return new Date()}
    }
});

module.exports = User;