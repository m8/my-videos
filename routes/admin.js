var express = require('express');
var router = express.Router();
var queries = require('../db/query');
var con = require('../db/con');


/* GET admin page. */
router.get('/', async function(req, res, next) {

    con.query("select * from user",function (err, result) {
        res.render('admin',{users:result});
    }); 
});

module.exports = router;
