
var express = require('express');
var categoryRouter = express.Router();
var connectionPool = require('../db/conn');

/* GET all categories of user. */
categoryRouter.get('/', async (req, res, next) => {
    if(req.session.user){

        const connection = await connectionPool.getConnection();
        const query = "SELECT * FROM category WHERE category.user_id = ?";
        const [categories] = await connection.execute(query, [req.session.user.id]);

        res.render('category', { categories: categories, name: req.session.user.name })
    }
    else{
        res.redirect('login');
    }
    /* try {
        console.log("response", response)
    } catch (exception) {
        console.log(exception)
    } */

})

/* ADD a category to the user */
categoryRouter.post('/add', async function(req, res, next) {
    if(req.session.user){
        const user_id = req.session.user.id;
        // const { video_url } = req.body;
        // console.log(video_url);
        // res.render('add_category');
        let { title, is_private } = req.body;
        const connection = await connectionPool.getConnection();

        //const query = "SELECT * FROM category where uuid=?";
        //const [videos] = await connection.execute(query, [video_url]);

            is_private = (is_private == 'on');
            const query = "INSERT INTO category (uuid,title,is_private, user_id) VALUES(?,?,?,?)"
            const video_uuid = uuidv4();
            const [rows] = await connection.execute(query, [video_uuid, title, is_private, user_id]);
            res.redirect('/category');
    }
    else{
        res.redirect('login');
    }
});

categoryRouter.get('/:uuid', async function(req,res,next){
    if(req.session.user){
        const connection = await connectionPool.getConnection();
        const query = "SELECT * FROM category_has_video,video WHERE category_has_video.category_uuid = ? and video.id = category_has_video.video_id";
        const [videos_of_categories] = await connection.execute(query, [req.params.uuid]);
        res.render('category_has_video', {videos: videos_of_categories})
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

module.exports = categoryRouter;