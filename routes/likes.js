const {Router} = require('express');
const router = new Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Like = require("../models/Like.model");

// like a post
router.post("/", isLoggedIn, (req, res, next) => {
    Like.findOne({creatorId: req.session.user._id, post: req.body.postId})
        .then((currentLike) => {
            if (currentLike == null) {
                Like.create({
                    post: req.body.postId,
                    creatorId: req.session.user._id
                }).then(createdLike => {
                    console.log(createdLike);
                    res.render('likes');
                }).catch(err => {
                    console.log(err);
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
        .finally((error) => {
            res.redirect('/posts');
        });
})

// dislike a post
router.post("/:id", isLoggedIn, (req, res, next) => {
    Like.findByIdAndDelete(req.params.id)
        .catch(err => {
            console.log(err);
        })
        .finally((error) => {
            res.redirect('/posts');
        });
})

module.exports = router;
