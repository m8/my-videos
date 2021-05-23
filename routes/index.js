var express = require('express');
var router = express.Router();
var connectionPool = require('../db/conn');

/* GET home page. */
router.get('/', async function (req, res, next) {
    if (req.session.user) {

        const connection = await connectionPool.getConnection();
        const query = "SELECT * FROM (SELECT * FROM user_has_video WHERE user_id = ?) AS W JOIN video on W.video_id = video.id ";
        const query2 = "SELECT * FROM category WHERE user_id= ?";
        const[categories] = await connection.execute(query2,[req.session.user.id]);
        const [videos] = await connection.execute(query, [req.session.user.id]);

        res.render('index', { name: req.session.user.name, videos: videos.reverse() , categories});
    }
    else {
        res.redirect('login');
    }
});

router.get('/channels', async function (req, res, next) {
    if (req.session.user) {

        const connection = await connectionPool.getConnection();
        const query = "SELECT * FROM user_follows_channel, channel WHERE user_follows_channel.user_id=? and user_follows_channel.channel_id = channel.id";
        const [channels] = await connection.execute(query, [req.session.user.id]);

        res.render('channels', { name: req.session.user.name, channels });
    }
    else {
        res.redirect('login');
    }
});

router.post('/add-video', async function (req, res, next) {
    if (req.session.user) {
        let video_id;
        let { video_url, video_name, uuid} = req.body;
        const connection = await connectionPool.getConnection();

        const query = "SELECT * FROM video where url=?";
        const [videos] = await connection.execute(query, [video_url]);

        if (videos.length == 0) {
            const query3 = "INSERT INTO video (url,name,source) VALUES(?,?,?)"
            const [rows] = await connection.execute(query3, [video_url, video_name, "youtube"])
            
            video_id = rows.insertId;

            const query2 = "INSERT INTO user_has_video (user_id,video_id,notes,rating) VALUES(?,?,?,?)"
            const [rows2] = await connection.execute(query2, [req.session.user.id, rows.insertId, "", 5])
        }
        else {
            video_id = videos[0].id;
            const query3 = "INSERT INTO user_has_video (user_id,video_id,notes,rating) VALUES(?,?,?,?)"
            const [rows3] = await connection.execute(query3, [req.session.user.id, videos[0].id, "", 5])

        }

        if(uuid != ""){
            const query4 = "INSERT INTO category_has_video (category_uuid, video_id) VALUES(?,?)"
            const [rows3] = await connection.execute(query4, [uuid, video_id]);

        }
        // const query = "SELECT * FROM (SELECT * FROM user_has_video WHERE user_id = ?) AS W JOIN video on W.video_id = video.id ";
        // const [videos] = await connection.execute(query, [req.session.user.id]);

        res.redirect('/');
    }
    else {
        res.redirect('login');
    }
});

router.post('/add-channel', async function (req, res, next) {
    if (req.session.user) {

        let { channel_url, name } = req.body;
        console.log("Channel_url", channel_url)
        const connection = await connectionPool.getConnection();

        const query = "SELECT * FROM channel WHERE url=?";
        const [channels] = await connection.execute(query, [channel_url]);
        console.log("channels", channels)


        if (channels.length == 0) {
            const query3 = "INSERT INTO channel (url,name) VALUES(?,?)"
            const [rows] = await connection.execute(query3, [channel_url, name])

            console.log("Inseted into channel")

            const query2 = "INSERT INTO user_follows_channel (user_id,channel_id,since) VALUES(?, ?, ?)"
            const [rows2] = await connection.execute(query2, [req.session.user.id, rows.insertId, new Date()])
            console.log("Inseted into user_follows_channel")
        }
        else {
            const query3 = "INSERT INTO user_follows_channel (user_id,channel_id,since) VALUES(?, ?, ?)"
            const [rows3] = await connection.execute(query3, [req.session.user.id, channels[0].id, new Date()])
        }

        // const query = "SELECT * FROM (SELECT * FROM user_has_video WHERE user_id = ?) AS W JOIN video on W.video_id = video.id ";
        // const [videos] = await connection.execute(query, [req.session.user.id]);

        res.redirect('/channels');
    }
    else {
        res.redirect('login');
    }
});

router.get('/login', async function (req, res, next) {
    res.render('login');
});

router.get('/details/:id', async function (req, res, next) {
    const { id } = req.params;
    const connection = await connectionPool.getConnection();

    const query = "SELECT * FROM user_has_video where user_id=? and video_id=?";
    const query2 = "SELECT * FROM video where id=?";

    const [videos] = await connection.execute(query, [req.session.user.id, id]);
    const [video] = await connection.execute(query2, [id]);

    res.render('details', { video: videos[0], vs: video[0] });
});

router.post('/details/:id', async function (req, res, next) {
    if(req.session.user){

        const { id } = req.params;
        const { notes, rating } = req.body;
        
        const connection = await connectionPool.getConnection();
        
        const query = "UPDATE user_has_video set notes=?, rating=? where user_id=? and video_id=?;";
        
        const [videos] = await connection.execute(query, [notes, rating, req.session.user.id, id]);    
    }
    res.redirect('/');
});

router.post('/login', async function (req, res, next) {

    const connection = await connectionPool.getConnection();
    const { username, password } = req.body;
    const query = "SELECT * FROM user WHERE username=? and password=?";
    const [row] = await connection.execute(query, [username, password]);

    if (row != null) {
        req.session.user = row[0];
        res.redirect('/')
    } else {
        res.render('login', { videos: null });
    }
})

router.get('/delete-video/:video_id', async function (req, res, next) {

    if(req.session.user){

        const connection = await connectionPool.getConnection();    
        const video_id = req.params.video_id;
        const query = "DELETE FROM user_has_video WHERE user_id=? and video_id=?";
        const [row] = await connection.execute(query, [req.session.user.id, video_id]);
        res.redirect('/');
    }
    else{
        res.redirect('login')
    }
})






module.exports = router;
