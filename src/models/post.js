const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;

const Post = new mongoose.model ('Post', {
    user: {
        required: true,
        type: ObjectId,
        ref: 'User'
    },
    description: String,
    image: {
        type: String,
        required: true
    },
    likes: [ObjectId],
    createdAt: {
        type: Date,
        default: () => {return new Date()}
    }
    
});

module.exports = Post;