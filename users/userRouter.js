const express = require('express');
const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');
const router = express.Router();

router.post('/', (req, res) => {
    const newUser = req.body;
    Users.insert(newUser)
        .then(newUser => {
            res.status(201).json(newUser);
        })
        .catch(() => {
            res.status(500).json({errorMessage: "Could not create user"});
        })
});

router.post('/:id/posts', (req, res) => {
    const user_id = req.params.id;
    const text = req.body.text;
    const PostInfo = {user_id, text};
    Posts.insert(PostInfo)
        .then(newPost => {
            res.status(201).json(newPost);
        })
        .catch(() => {
            res.status(500).json({errorMessage: "Could not create new post"});
        })
});

router.get('/', (req, res) => {
    Users.get()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(() => {
            res.status(500).json({errorMessage: "Could not get users"})
        })
});

router.get('/:id', (req, res) => {

});

router.get('/:id/posts', (req, res) => {
    const{id} = req.params;
    Users.getUserPosts(id)
    .then(userPosts => {
        res.status(200).json(userPosts);
    })
    .catch(() => {
        res.status(500).json({errorMessage: "Could not get this user's posts"});
    })
});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {

};

function validateUser(req, res, next) {

};

function validatePost(req, res, next) {

};

module.exports = router;
