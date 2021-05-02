var express = require('express');
var router = express.Router();
let conn = require('../db/conn');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let s = 'deneme'
  res.redirect('/add-video');
});

module.exports = router;
