const User = require('../models/user');
const config = require('../config/env/index');

async function auth(req, res, next) {
    const userId = req.cookies[config.cookieName];
    if(!userId){
        res.sendStatus(403);
        return;
    }

    const user = await User.findById(userId);
    if(!user) return res.sendStatus(403);

    req.user = user;
    next();
    
};

module.exports = auth;