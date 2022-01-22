const { Router } = require('express');
const router = new Router();
const isLoggedIn = require("../../middleware/isLoggedIn");
const Post = require("../../models/Post.model");

router.post("/create", isLoggedIn, (req, res, next) => {
    console.log("here is the user", req.user);
    Post.create({
        title: req.body.title,
        body: req.body.body,
        creatorId: req.user._id
    }).then(createdPost => {

        console.log(createdPost);
        res.render("index")
    }).catch(err => {
        console.log(err);
    })
})
router.get('/all-posts', (req, res) => {
    Post.find()
      .then((results) => {
        console.log('These are the posts', results);
        // res.json(results);
        res.render('allPosts', { posts: results });
      })
      .catch((err) => {
        console.log('Something went wrong', err);
      });
  });

module.exports = router;