const express = require('express');
const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
    const newUser = req.body;
    Users.insert(newUser)
        .then(newUser => {
            res.status(201).json(newUser);
        })
        .catch(() => {
            res.status(500).json({errorMessage: "Could not create user"});
        })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
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

router.get('/:id', validateUserId, (req, res) => {
    const {id} = req.params;
    Users.getById(id)
    .then(user => {
        res.status(200).json(user);
    })
    .catch(() => {
        res.status(500).json({errorMessage: "Could not get this user"});
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
    const{id} = req.params;
    Users.getUserPosts(id)
    .then(userPosts => {
        res.status(200).json(userPosts);
    })
    .catch(() => {
        res.status(500).json({errorMessage: "Could not get this user's posts"});
    })
});

router.delete('/:id', validateUserId,(req, res) => {
    const{id} = req.params;
    Users.remove(id)
    .then(id => {
        res.status(200).json({message: "This user has been deleted!"});
    })
    .catch(() => {
        res.status(500).json({errorMessage: "Could not delete user"});
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
    const {id} = req.params;
    const update = req.body;
    Users.getById(id)
    .then(user => {
        if(user) {
            Users.update(id, update) 
            .then (updated => {
                Users.getById(id).then(updatedUser => {
                    res.status(200).json(updatedUser);
                });
            });
        } else {
            res.status(400).json({errorMessage: "This user does not exist"})
        }
    })
    .catch(() => {
        res.status(400).json({errorMessage: "Could not update user"});
    })
});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;
    Users.getById(id).then( user => {
        if(user){
            req.user = user;
            next();
        } else {
            res.status(400).json({errorMessage: "invalid user id"});
        };
    }).catch(() => {
        res.status(500).json({errorMessage: "Server couldn't process your request"})
    });
};

function validateUser(req, res, next) {
    if(JSON.stringify(req.body) !== '{}'){
        if(req.body.name){
            next();
        } else {
            res.status(400).json({errorMessage: "missing required name feild"})
        }
    } else {
        res.status(400).json({erroMessage: "missing user data"})
    };
};

function validatePost(req, res, next) {
    if(JSON.stringify(req.body) !== '{}'){
        if(req.body.text){
            next();
        } else {
            res.status(400).json({erroMessage: "missing required text field"});
        }
    } else {
        res.status(400).json({errorMessage: "missing post data"});
    }
};

module.exports = router;