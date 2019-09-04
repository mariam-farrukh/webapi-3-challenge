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

router.get('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

// custom middleware

function validatePostId(req, res, next) {

};

module.exports = router;