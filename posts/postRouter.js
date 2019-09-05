const express = require('express');
const Posts = require("./postDb.js")
const router = express.Router();

router.get('/', (req, res) => {
    Posts.get()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(() => {
            res.status(500).json({ errorMessage: "Can't access posts from database."})
        })
});

router.get('/:id', validatePostId, (req, res) => {
    const {id} = req.params;
    Posts.getById(id)
        .then(post => {
            res.status(200).json(post);
        })
        .catch(() => {
            res.status(500).json({errorMessage: "Can't access this post from database."})
        })
});

router.delete('/:id', validatePostId, (req, res) => {
    const {id} = req.params;
    Posts.remove(id)
        .then(post => {
            res.status(200).json({message: "This post has successfully been deleted."})
        })
        .catch(() => {
            res.status(500).json({errorMessage: "Could not delete post."})
        })
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
    const {id} = req.params;
    const update = req.body;
    Posts.update(id, update)
        .then(updated => {
            Posts.getById(id)
                .then(updatedPost => {
                    res.status(200).json(updatedPost);
                });
        })
        .catch(() => {
            res.status(500).json({errorMessage: "Could not update post."})
        })
});

// custom middleware

function validatePostId(req, res, next) {
    const { id } = req.params;
    Posts.getById(id).then( post => {
        if(post){
            req.post = post;
            next();
        } else {
            res.status(400).json({message: "invalid post id"});
        };
    }).catch(error => {
        res.status(500).json({error: "Server couldn't process your request"})
    });
};

function validatePost(req, res, next) {
    if(JSON.stringify(req.body) !== '{}'){
        if(req.body.text){
            next();
        } else {
            res.status(400).json({message: "missing required text field"});
        }
    } else {
        res.status(400).json({message: "missing post data"});
    }
};

module.exports = router;