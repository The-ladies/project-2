const {Router} = require('express');
const router = new Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const Like = require("../models/Like.model");

// index
router.get('/', (req, res) => {
    Post.find().populate('creatorId').sort({createdAt: 'desc'})
        .then(async (results) => {
            for (let i = 0; i < results.length; i++) {
                let like = await Like.findOne({creatorId: req.session.user._id, post: results[i]._id}).exec();
                if (like === null) {
                    results[i].isLiked = false;
                } else {
                    results[i].isLiked = true;
                    results[i].likeId = like._id
                }

                results[i].likesCount = await Like.find({post: results[i]._id}).count().exec();
            }
            console.log('These are the posts', results);
            res.render('posts/index', {posts: results});
        })
        .catch((err) => {
            console.log('Something went wrong', err);
        });
});

// new
router.get('/new', (req, res) => {
    res.render('posts/new');
});

// show
router.get('/:id', (req, res) => {
    Post.findById(req.params.id).populate('creatorId')
        .then((post) => {
            Comment.find({post: req.params.id}).sort({createdAt: 'desc'})
                .then(foundComment => {
                    res.render('posts/show', {post: post, comments: foundComment});
                    console.log(foundComment);
                })

        })
        .catch((err) => {
            console.log('Something went wrong', err);
        });
});

// edit
router.get('/:id/edit', (req, res) => {
    Post.findOne({creatorId: req.session.user._id, _id: req.params.id}).populate('creatorId')
        .then((post) => {
            res.render('posts/edit', {post: post});
        })
        .catch((err) => {
            console.log('Something went wrong', err);
        });
});

// create
router.post('/', isLoggedIn, (req, res, next) => {
    console.log("here is the user", req.user);
    Post.create({
        title: req.body.title,
        body: req.body.body,
        creatorId: req.user._id
    }).then(createdPost => {
        console.log(createdPost);
        res.redirect(`/posts/${createdPost._id}`)
    }).catch(err => {
        console.log(err);
    })
})

// update
router.post('/:id', isLoggedIn, (req, res, next) => {
    Post.findOneAndUpdate({creatorId: req.session.user._id, _id: req.params.id}, {title: req.body.title, body: req.body.body})
        .then((post) => {
            res.redirect(`/posts/${post._id}`);
        })
        .catch((err) => {
            console.log('Something went wrong', err);
        });
})

// delete
router.post('/:id/delete', isLoggedIn, (req, res, next) => {
    Post.findOneAndRemove({creatorId: req.session.user._id, _id: req.params.id})
        .then((post) => {
            if (post !== null) {
                Comment.deleteMany({post: post._id});
            }
        })
        .catch(err => {
            console.log(err);
        })
        .finally((error) => {
            res.redirect('/posts');
        });
})


module.exports = router;
