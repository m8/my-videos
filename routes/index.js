var express = require('express');
var router = express.Router();
var connectionPool = require('../db/conn');
const ytdl = require('ytdl-core');
const http = require('https')
/* GET home page. */
router.get('/', async function (req, res, next) {
    if (req.session.user) {

        const connection = await connectionPool.getConnection();
        const query = "SELECT * FROM video, user_has_video WHERE video.id = user_has_video.video_id and user_has_video.user_id = ?";
        const query2 = "SELECT * FROM category WHERE user_id= ?";
        const [categories] = await connection.execute(query2, [req.session.user.id]);
        const [videos] = await connection.execute(query, [req.session.user.id]);

        res.render('index', { name: req.session.user.name, videos: videos.reverse(), categories });
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
        const query2 = "SELECT * FROM category WHERE user_id= ?";
        const [categories] = await connection.execute(query2, [req.session.user.id]);


        res.render('channels', { name: req.session.user.name, channels, categories });
    }
    else {
        res.redirect('login');
    }
});

router.post('/add-video', async function (req, res, next) {
    if (req.session.user) {
        let video_id;
        let { video_url, video_name, uuid } = req.body;
        const connection = await connectionPool.getConnection();

        const query = "SELECT * FROM video where url=?";
        const [videos] = await connection.execute(query, [video_url]);

        let real_video_title = "";

        let info = await ytdl.getInfo(video_url);
        console.log(info);
        real_video_title = info.videoDetails.title;


        if (videos.length == 0) {
            const query3 = "INSERT INTO video (url,name,source) VALUES(?,?,?)"
            const [rows] = await connection.execute(query3, [video_url, real_video_title, "youtube"])

            const query2 = "INSERT INTO user_has_video (user_id,video_id,notes,rating,title) VALUES(?,?,?,?,?)"
            const [rows2] = await connection.execute(query2, [req.session.user.id, rows.insertId, "", 5, video_name])
            video_id = rows2.insertId;

            if (uuid != "") {
                const query4 = "INSERT INTO category_has_video (category_uuid, video_id) VALUES(?,?)"
                const [rows3] = await connection.execute(query4, [uuid, video_id]);
    
            }
        }
        else {
            
            const query5 = "SELECT * FROM user_has_video, video WHERE user_has_video.video_id = video.id and video.url = ? "
            const [sw] = await connection.execute(query5, [video_url])
      

            if(sw.length == 0){
                const query3 = "INSERT INTO user_has_video (user_id,video_id,notes,rating,title) VALUES(?,?,?,?,?)"
                const [rows3] = await connection.execute(query3, [req.session.user.id, videos[0].id, "", 5, video_name])
                video_id = rows3.insertId;

                if (uuid != "") {
                    const query4 = "INSERT INTO category_has_video (category_uuid, video_id) VALUES(?,?)"
                    const [rows3] = await connection.execute(query4, [uuid, video_id]);
        
                }
                
            }

        }

       
        // const query = "SELECT * FROM (SELECT * FROM user_has_video WHERE user_id = ?) AS W JOIN video on W.video_id = video.id ";
        // const [videos] = await connection.execute(query, [req.session.user.id]);

        res.redirect('/');
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
    console.log(id);
    const query = "SELECT * FROM user_has_video,video WHERE user_has_video.id=? and video.id = user_has_video.video_id";
    //const query2 = "SELECT * FROM video where id=?";

    const query3 = "SELECT * FROM category WHERE user_id= ?";
    const [categories] = await connection.execute(query3, [req.session.user.id]);


    const [videos] = await connection.execute(query, [id]);
    //const [video] = await connection.execute(query2, [id]);
    console.log(videos[0])

    res.render('details', { video: videos[0], categories });
});

router.post('/details/:id', async function (req, res, next) {

    if (req.session.user) {

        const { id } = req.params;
        const { notes, rating, title, categories } = req.body;
        console.log(req.body);

        const connection = await connectionPool.getConnection();

        const query2 = "DELETE FROM category_has_video where video_id=?";
        const [del] = await connection.execute(query2, [id]);

        if(categories){
            let q = "INSERT INTO category_has_video (category_uuid, video_id) VALUES(?,?)"
            if(typeof(categories) == 'string'){
                await connection.execute(q, [categories, id]);
            }
            else{
                for (var k = 0; k < categories.length; k++) {
                    await connection.execute(q, [categories[k], id]);
                }
            }
        }

        const query = "UPDATE user_has_video set notes=?, title= ?, rating=? where user_id=? and id=?;";
        const [videos] = await connection.execute(query, [notes, title, rating, req.session.user.id, id]);
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

    if (req.session.user) {

        const connection = await connectionPool.getConnection();
        const video_id = req.params.video_id;
        const query = "DELETE FROM user_has_video WHERE user_id=? and video_id=?";
        const [row] = await connection.execute(query, [req.session.user.id, video_id]);
        res.redirect('/');
    }
    else {
        res.redirect('login')
    }
})






module.exports = router;
