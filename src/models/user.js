const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;

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
        maxlength: 2000
        
    },
    savedPosts: [ObjectId],
    createdAt: {
        type: Date,
        default: () => {return new Date()}
    }
});

module.exports = User;