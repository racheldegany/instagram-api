const md5 = require('md5');
const User = require('../models/user');
const config = require('../config/env/index');
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
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
        //avatar: req.file.filename
        try{
        if (req.user.id !== req.params.id) return res.sendStatus(403);
            const { username, bio, email } = req.body;
            const updateValues = { username ,bio, email,};
            console.log(updateValues);
            for (const key in updateValues) {
                // if(key === 'bio') {
                //     return;
                // } this doesnt work
                if(updateValues[key] === '') {
                    delete updateValues[key] ;
                }
            }
            if(req.file) {
                updateValues.avatar = req.file.filename;
            }
            console.log(updateValues);
            if(Object.keys(updateValues).length === 0) {
                res.sendStatus(400);
                return;
            }
            const user = await User.findByIdAndUpdate(req.params.id, 
                updateValues,
                {new: true}
            );
            console.log(user);
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
            const token = jwt.sign({id: user._id}, config.secret);
            res.cookie(config.cookieName, token, { maxAge: DURATION_60D, sameSite: 'None', secure: true });
            res.status(200).json(user);
        } catch(err) {
            console.log(err);
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

    async getUser (req, res) {
        try{
            const user = await User.findById(req.params.id)
                .select(['username', 'bio', 'avatar', 'createdAt']);
            if(!user) res.sendStatus(404);
            res.json(user);
        } catch(err){
            console.log(err);
            res.sendStatus(500);
        }
    }
}



module.exports = new Users();