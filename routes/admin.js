var express = require('express');
var router = express.Router();
var queries = require('../db/query');
var connectionPool = require('../db/conn');
var models = require('./models/admin_models');

/* GET admin page. */
router.get('/', async function (req, res, next) {
    const connection = await connectionPool.getConnection();

    const [userRows, fields] = await connection.execute("SELECT * FROM user")
    const [videoRows, videoFields] = await connection.execute("SELECT * FROM video")
    const [categoryRows, categoryFields] = await connection.execute("SELECT * FROM category")
    const [channelRows, channelFields] = await connection.execute("SELECT * FROM channel")

    res.render('admin', { users: userRows, videos: videoRows, category: categoryRows, channels: channelRows});

});

router.get('/add-user', (req, res, next) => {
    res.render('admin_add_db',{form: models.add_user_model})
})

router.get('/add-video', (req, res, next) => {
    res.render('admin_add_db',{form: models.add_video_model})
})

router.get('/add-channel', (req, res, next) => {
    res.render('admin_add_db',{form: models.add_video_channel})
})

router.get('/add-category', (req, res, next) => {
    res.render('admin_add_db',{form: models.add_video_category})
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


router.post('/add-category', async function (req, res, next) {
    const { title, name, source, duration } = req.body;
    const connection = await connectionPool.getConnection();
    const query = "INSERT INTO video (url, name, source, duration) VALUES(?, ?, ?, ?)"
    const [rows] = await connection.execute(query, [url, name, source, duration])

    /* con.query(`INSERT INTO user SET ?`, { name, surname, email, username, password }, function (err, result) { }); */
    res.redirect('/admin');
});


router.get('/delete/:db/:id', async function (req, res, next) {
    const {id,db}  = req.params;
    const connection = await connectionPool.getConnection();
    const query = `DELETE FROM ${db} WHERE id=?`
    await connection.execute(query, [id]);
    res.redirect('/admin');
});

module.exports = router;
