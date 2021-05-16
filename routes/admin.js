var express = require('express');
var router = express.Router();
var queries = require('../db/query');
var connectionPool = require('../db/conn');
var models = require('./models/admin_models');
var form_models = require('./models/form_model');


/* GET admin page. */
router.get('/', async function (req, res, next) {
    const connection = await connectionPool.getConnection();

    const [userRows, fields] = await connection.execute("SELECT * FROM user")
    const [videoRows, videoFields] = await connection.execute("SELECT * FROM video")
    const [categoryRows, categoryFields] = await connection.execute("SELECT * FROM category")
    const [channelRows, channelFields] = await connection.execute("SELECT * FROM channel")
    const [userVideosRows, userVideosFields] = await connection.execute("SELECT * FROM user_has_video")
    const [categoryHasVideoRow, categoryHasVideoField] = await connection.execute("SELECT * FROM category_has_video")

    res.render('admin', { users: userRows, videos: videoRows, category: categoryRows, channel: channelRows, user_videos: userVideosRows, category_has_video: categoryHasVideoRow, form_models });
});

router.get('/add-user', (req, res, next) => {
    res.render('admin_add_db', { form: models.add_user_model })
})

router.get('/add-video', (req, res, next) => {
    res.render('admin_add_db', { form: models.add_video_model })
})

router.get('/add-channel', (req, res, next) => {
    res.render('admin_add_db', { form: models.add_video_channel })
})

router.get('/add-category', (req, res, next) => {
    res.render('admin_add_db', { form: models.add_video_category })
})

router.get('/add-user-video', (req, res, next) => {
    res.render('admin_add_db', { form: models.user_video_model })
})

router.get('/add-category-has-video', (req, res, next) => {
    res.render('admin_add_db', { form: models.add_category_has_video })
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


router.post('/add-user-video', async function (req, res, next) {
    const { user_id, video_id, notes, rating } = req.body;
    const connection = await connectionPool.getConnection();
    const query = "INSERT INTO user_has_video (user_id, video_id, notes, rating) VALUES(?, ?, ?, ?)"
    const [rows] = await connection.execute(query, [user_id, video_id, notes, rating])

    /* con.query(`INSERT INTO user SET ?`, { name, surname, email, username, password }, function (err, result) { }); */
    res.redirect('/admin');
});


router.post('/add-category', async function (req, res, next) {
    let { title, is_private, user_id } = req.body;
    is_private = (is_private == 'on');
    const connection = await connectionPool.getConnection();
    const query = "INSERT INTO category (uuid,title,is_private,user_id) VALUES(?,?,?,?)"
    const [rows] = await connection.execute(query, [uuidv4(), title, is_private, user_id])

    /* con.query(`INSERT INTO user SET ?`, { name, surname, email, username, password }, function (err, result) { }); */
    res.redirect('/admin');
});

router.post('/add-channel', async function (req, res, next) {
    let { url, name} = req.body;
    const connection = await connectionPool.getConnection();
    const query = "INSERT INTO channel (url,name) VALUES(?,?)"
    const [rows] = await connection.execute(query, [url,name])

    res.redirect('/admin');
});


router.post('/add-category-has-video', async function (req, res, next) {
    let { category_uuid, video_id } = req.body;
    console.log(category_uuid, video_id);
    const connection = await connectionPool.getConnection();
    const query = "INSERT INTO category_has_video (category_uuid,video_id) VALUES (?,?)"
    const [rows] = await connection.execute(query, [category_uuid, video_id])

    res.redirect('/admin');
});



router.get('/delete/:db/:id', async function (req, res, next) {
    const { id, db } = req.params;
    const connection = await connectionPool.getConnection();
    const query = `DELETE FROM ${db} WHERE id=?`
    await connection.execute(query, [id]);
    res.redirect('/admin');
});

router.get('/search/', async function (req, res, next) {
    console.log(req.query.query);
    const connection = await connectionPool.getConnection();
    let result = await connection.execute(req.query.query);
    res.send(result);
});



function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


module.exports = router;
