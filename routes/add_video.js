var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/add-video', function(req, res, next) {
    res.render('add_video');
});

router.post('/add-video', function(req, res, next) {
    const { video_url } = req.body;
    console.log(video_url);
    res.render('add_video');
});

module.exports = router;
