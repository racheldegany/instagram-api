const md5 = require('md5');
const User = require('../models/user');
const config = require('../config/env/index');
const Post = require('../models/post');
const ERROR_DUPLICATE_VALUE = 11000;
const DURATION_60D = 60 * 60 * 24 * 60 * 1000;

class Users {

    async searchAll (req, res) {
        const regex = new RegExp(req.query.username || '', 'i');
        try{
            const users = await User.find({
                username: regex
            })
                .select(['username', 'avatar', 'bio', '_id'])
                .limit(10);
            res.json(users);
        } catch(err){
            console.log(err);
            res.sendStatus(500);
        }
    }

    async editProfile(req, res) {
        try{
            const { username, bio, email } = req.body
            const updateValues = { username, avatar: req.file.filename ,bio, email}
            const user = await User.findByIdAndUpdate(req.params.id, 
                updateValues,
                {new: true}
            );
            res.json(user);
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }

    async getPosts(req, res) {
        try{
            const posts = await Post.find({
                user: req.params.id  
                })
                .populate('user', ['avatar', 'username'])
                .sort({createdAt: req.query.sort || 1});
            res.json(posts);
        } catch(err) {
            console.log(err);
            res.sendStatus(400);
        }
    }

    async login(req, res) {
        const userToSearch = req.body;
        
        userToSearch.password = md5(userToSearch.password);
        try {
            const user = await User.findOne({
                username: userToSearch.username,
                password: userToSearch.password
            });
            if(!user) return res.sendStatus(401);
            res.cookie(config.cookieName, user._id, { maxAge: DURATION_60D});
            res.status(200).json(user);
        } catch {
            res.sendStatus(500);
        }  
    } 

    

    async check(req, res) {
        const {username, email} = req.query;

        if (!username && !email) {
			res.sendStatus(400);
			return;
		}
        let property = email ? 'email' : 'username';
        
        try {
            const isExist = await User.exists({
				[property]: req.query[property]
			});
            res.json(isExist);
            
        } catch(err) {
            console.log(err);
            res.sendStatus(400);
            
        }
        
    }
    

    async create(req, res){
        const newUser = new User(req.body);
        newUser.password = md5(newUser.password);
        try {
            const createdUser = await newUser.save();
            res.status(201).json(createdUser)
        } catch(err) {
            console.log(err);
            if(err.code === ERROR_DUPLICATE_VALUE ) {
                res.sendStatus(409);
                return;
            }
            console.log(err);
            res.status(400).json(err);
        }
    }

    me(req, res) {
        res.json(req.user);
    }
}



module.exports = new Users();