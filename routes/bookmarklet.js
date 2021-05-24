
var express = require('express');
var bookmarkletRouter = express.Router();
var connectionPool = require('../db/conn');

/* GET all categories of user. */
bookmarkletRouter.get('/add/:url/:name', async (req, res, next) => {
    if(req.session.user){
        console.log("vyr");
        let {url,name} = req.params;
        const connection = await connectionPool.getConnection();
        const query = "SELECT * FROM category WHERE category.user_id = ?";
        const [categories] = await connection.execute(query, [req.session.user.id]);

        res.render('bookmarklet/add.ejs', {url,name,categories})
    }   
    else{
        res.redirect('/');
    }
})

bookmarkletRouter.post('/add-video', async function (req, res, next) {
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

        res.send("<script>window.close();</script > ");
    }
    else {
        res.redirect('login');
    }
});


module.exports = bookmarkletRouter;