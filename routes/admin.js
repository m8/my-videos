var express = require('express');
var router = express.Router();
var queries = require('../db/query');
var connectionPool = require('../db/conn');


/* GET admin page. */
router.get('/', async function (req, res, next) {
    const connection = await connectionPool.getConnection();

    const [userRows, fields] = await connection.execute("SELECT * FROM user")
    const [videoRows, videoFields] = await connection.execute("SELECT * FROM video")

    res.render('admin', { users: userRows, videos: videoRows });

});


router.get('/add-user', (req, res, next) => {
    res.render('add_user')
})

router.get('/add-video', (req, res, next) => {
    res.render('admin_add_video')
})

router.post('/add-user', async function (req, res, next) {
    const { name, surname, email, username, password } = req.body;
    const connection = await connectionPool.getConnection();
    const query = "INSERT INTO user (name, surname, email, username, password) VALUES(?, ?, ?, ?, ?)"
    const [rows] = await connection.execute(query, [name, surname, email, username, password])

    /* con.query(`INSERT INTO user SET ?`, { name, surname, email, username, password }, function (err, result) { }); */
    res.redirect('/admin');
});

router.post('/add-video', async function (req, res, next) {
    const { url, name, source, duration } = req.body;
    const connection = await connectionPool.getConnection();
    const query = "INSERT INTO video (url, name, source, duration) VALUES(?, ?, ?, ?)"
    const [rows] = await connection.execute(query, [url, name, source, duration])

    /* con.query(`INSERT INTO user SET ?`, { name, surname, email, username, password }, function (err, result) { }); */
    res.redirect('/admin');
});

module.exports = router;
