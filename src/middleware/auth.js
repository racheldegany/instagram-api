const User = require('../models/user');
const config = require('../config/env/index');
const jwt = require('jsonwebtoken');

async function auth(req, res, next) {
    const token = req.cookies[config.cookieName];
    if(!token){
        res.sendStatus(403);
        return;
    }
    
    try{
        const payload = jwt.verify(token, config.secret);
        const user = await User.findById(payload.id);
        if(!user) return res.sendStatus(403);
    
        req.user = user;
        next();
        
    } catch(err){
        console.log(err);
        res.sendStatus(403);
    }


};

module.exports = auth;