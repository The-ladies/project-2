const {Router} = require('express');
const router = new Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Comment  = require("../models/Comment.model");

// create
router.post('/', isLoggedIn, (req, res, next) => {
    console.log("here is the comment", req.comment);
    Comment.create({
        author: req.body.author,
        post: req.body.post,
        text: req.text,
    }).then(createdComment => {
        console.log(createdComment);
        res.redirect(`/posts/${createdPost._id}`)
    }).catch(err => {
        console.log(err);
    })
})


module.exports = router;