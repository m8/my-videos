var express = require('express');
var router = express.Router();
var queries = require('../db/query');
var con = require('../db/conn');


/* GET admin page. */
router.get('/', async function (req, res, next) {
    con.query("select * from user", function (err, result) {
        res.render('admin', { users: result });
    });
});

router.post('/add-user', async function (req, res, next) {
    const { name, surname, email, username, password } = req.body;
    await con.query(`INSERT INTO user SET ?`, { name, surname, email, username, password }, function (err, result) { });
    res.redirect('/admin');
});

module.exports = router;
