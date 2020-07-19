const Post = require('../models/post');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;

class Posts {

    async create(req, res) {
        const post = new Post({
            image: req.file.filename,
            description: req.body.description,
            user: req.user._id
        });
        try{
            const createdPost = await post.save();
            res.status(201).json(createdPost);
        } catch(err){
            console.log(err);
            res.sendStatus(400);
        }
    }

    async getAll(req, res) {
        try{
            const posts = await Post.find()
                .populate('user', ['avatar', 'username'])
                .sort({createdAt: req.query.sort || 1});
            res.status(200).json(posts);
        } catch(err) {
            console.log(err);
            res.sendStatus(400);
        } 
    }

    async handleLike(req, res) {
        try {
            // const filter = {_id: ObjectId(req.params.id)} 
            const post = await Post.findByIdAndUpdate(req.params.id, 
                {$addToSet: {likes: req.user._id}},
                {new: true});   
            if(!post){
                res.sendStatus(400);
                return;
            }
            console.log(post);
            
            res.json(post);

        } catch(err) {
            console.log(err);
            res.sendStatus(400);
        }
    }
}



module.exports = new Posts();