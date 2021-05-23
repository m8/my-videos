
var express = require('express');
var categoryRouter = express.Router();

/* GET all categories of user. */
categoryRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    console.log("channelId", id)

    /* let response = null */
    const response = await ytch.getChannelInfo(id, 0)
    console.log(response)
    res.render('channel', { source: response })

    /* try {
        console.log("response", response)
    } catch (exception) {
        console.log(exception)
    } */

})

/* ADD a category to the user */
categoryRouter.post('/add-category', function(req, res, next) {
    if(req.session.user){
        const user_id = req.session.user.id;
        // const { video_url } = req.body;
        // console.log(video_url);
        // res.render('add_category');
        let { video_title, is_private } = req.body;
        const connection = await connectionPool.getConnection();

        //const query = "SELECT * FROM category where uuid=?";
        //const [videos] = await connection.execute(query, [video_url]);


            const query = "INSERT INTO category (uuid,title,is_private, user_id) VALUES(?,?,?,?)"
            const video_uuid = uuidv4();
            const [rows] = await connection.execute(query, [video_uuid, video_title, is_private, user_id])

            const query2 = "INSERT INTO user_has_video (user_id,video_id,notes,rating) VALUES(?,?,?,?)"
            const [rows2] = await connection.execute(query2, [req.session.user.id, rows.insertId, "", 5])
       
  
            const query3 = "INSERT INTO user_has_video (user_id,video_id,notes,rating) VALUES(?,?,?,?)"
            const [rows3] = await connection.execute(query3, [req.session.user.id, videos[0].id, "", 5])
 
    }
    else{
        res.redirect('login');
    }
});


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

module.exports = channelRouter;