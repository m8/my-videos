var express = require('express');
var router = express.Router();
var queries = require('../db/query');
var connectionPool = require('../db/conn');


/* GET admin page. */
router.get('/', async function (req, res, next) {
    const connection = await connectionPool.getConnection();

    const [userRows, fields] = await connection.execute("select * from user")
    const [videoRows, videoFields] = await connection.execute("SELECT * FROM video")


    /* con.query("select * from user", function (err, result) {
        console.log("result 1", result);
        if (err) {
            throw Error("there is a problem fetching users");
        }
        users = result;
    }); */

    /* console.log("users", users)

    con.query("select * from video", function (err, result) {
        console.log("result 2", result);
        if (err) {
            throw Error("there is a problem fetching users");
        }
        videos = result;
    });

    console.log("users", users) */
    res.render('admin', { users: userRows, videos: videoRows });

});

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
