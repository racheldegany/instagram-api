const express = require('express');
const users = require('../controllers/users');
const posts = require('../controllers/posts');
const auth = require('../middleware/auth');
const pathSelection = require('../middleware/pathSelection');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/' + req.type)
      
    },
    filename: function (req, file, cb) {
        const extentionIndex = file.originalname.lastIndexOf('.');
        const extention = file.originalname.slice(extentionIndex);
        let filename = Math.random().toString(36).substring(2,9);
      cb(null, filename + extention);
    }
  });
   
const upload = multer({ storage: storage });
const routes = express.Router();

routes.get('/users', auth, users.searchAll);
routes.put('/users', users.create);
routes.post('/users/login', users.login);
routes.get('/users/check', users.check );
routes.get('/users/me', auth, users.me);
routes.get('/users/:id/posts',auth, users.getPosts);
routes.post('/users/:id', pathSelection('avatars'), upload.single('image'), users.editProfile)

routes.put('/posts', auth, pathSelection('posts'), upload.single('image'), posts.create);
routes.get('/posts', auth, posts.getAll);
routes.post('/posts/:id/likes',auth, posts.handleLike); //continue likes


routes.get('/health', (req, res) => {
    res.send();
});



module.exports = routes;