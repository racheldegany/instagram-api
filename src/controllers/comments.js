const Comment = require('../models/comment');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types


class Comments{

    async create(req, res){
        const values = {
            content: req.body.content,
            postId: req.params.id,
            user: req.user._id
        };
        const comment = new Comment(values);
        try {
            const newComment = await comment.save();
            await newComment
                .populate('user', ['avatar', 'username'])
                .execPopulate();
            res.status(201).json(newComment);
        } catch(err) {
            console.log(err);
            res.sendStatus(400);
        }
    }

    async getComments(req, res) {
        try{
            const comments = await Comment.find({
                postId: req.params.id
            })
                .populate('user', ['avatar', 'username'])
            res.status(200).json(comments);
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        } 
    }

}
module.exports = new Comments();