const { Router } = require('express');
const router = new Router();
const isLoggedIn = require("../../middleware/isLoggedIn");
const Like = require("../../models/Like.model");

router.post("/likes", isLoggedIn, (req, res, next) => {
    console.log("here is the likes page", req.user);
    Like.create({
        title: req.body.title,
        body: req.body.body,
        creatorId: req.user._id
    }).then(createdLike => {

        console.log(createdLike);
        res.render("index")
    }).catch(err => {
        console.log(err);
    })
})
router.get('/likes', (req, res) => {
    Like.find()
      .then((results) => {
        console.log('likes', results);
        // res.json(results);
        res.render('Likes', { likes: results });
      })
      .catch((err) => {
        console.log('Something went wrong', err);
      });
  });

module.exports = router;