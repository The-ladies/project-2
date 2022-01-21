const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/likes', (req, res, next) => {
  res.render('likes');
});

router.get('/newgab', (req, res, next) => {
  res.render('newgab');
});

module.exports = router;
