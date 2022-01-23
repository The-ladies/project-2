const {Router} = require('express');
const router = new Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Post = require("../models/Post.model");

// index
router.get('/', (req, res) => {
    Post.find().populate('creatorId')
        .then((results) => {
            console.log('These are the posts', results);
            // res.json(results);
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
            res.render('posts/show', {post: post});
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

module.exports = router;