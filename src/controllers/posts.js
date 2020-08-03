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
            res.sendStatus(500);
        } 
    }

    async getPost(req, res) {
        try{
            const post = await Post.findById(req.params.id)
            .populate('user', ['avatar', 'username']);
            if(!post) return res.sendStatus(404);
            res.json(post);
        } catch(err){
            console.log(err);
            res.sendStatus(500);
        }
    }

    async like(req, res) {
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

    async unlike(req, res) {
		if (req.user._id.toString() !== req.params.userId) {
			res.sendStatus(403);
			return;
		}
		try {
            const post = await Post.findByIdAndUpdate(req.params.id, 
                {$pull: {likes: req.user._id}},
                {new: true});
			res.json(post);
		} catch(err) {
			res.status(500).json(err);
		}
	}
}



module.exports = new Posts();