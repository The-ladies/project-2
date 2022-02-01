const {Router} = require('express');
const router = new Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Comment  = require("../models/Comment.model");


// create
router.post('/', isLoggedIn, (req, res, next) => {
    Comment.create({
        author: req.user._id,
        post: req.body.postId,
        text: req.body.body,
    }).then(comment => {
        console.log(comment);
        res.redirect(`/posts/${comment.post}`)
    }).catch(err => {
        console.log(err);
    })
})


module.exports = router;
