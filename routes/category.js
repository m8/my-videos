
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


/* ADD a category to the user */
categoryRouter.post('/add-channel', async function(req, res, next) {
    if(req.session.user){
        const user_id = req.session.user.id;

        let { uuid, channel_id } = req.body;

        const connection = await connectionPool.getConnection();    

        const q1 = "DELETE FROM category_has_channel where category_has_channel.channel_id = ?";
        const [rows2] = await connection.execute(q1, [channel_id]);


        if(uuid != ""){

            const query = "INSERT INTO category_has_channel (category_uuid,channel_id) VALUES(?,?)"
            const [rows] = await connection.execute(query, [uuid, channel_id]);
        }
        res.redirect('/category');
    }
    else{
        res.redirect('login');
    }
});


categoryRouter.get('/:uuid', async function(req,res,next){
    if(req.session.user){
        const connection = await connectionPool.getConnection();
        const query = "SELECT * FROM category_has_video,video, user_has_video WHERE category_has_video.category_uuid = ? and user_has_video.id = category_has_video.video_id and user_has_video.video_id = video.id ";
        const [videos_of_categories] = await connection.execute(query, [req.params.uuid]);
        

        const query3 = "SELECT * FROM category_has_channel,channel WHERE category_has_channel.channel_id = channel.id and category_has_channel.category_uuid = ? "
        const [channels] = await connection.execute(query3, [req.params.uuid]);

        console.log(channels)

        const query2 = "SELECT * FROM category WHERE user_id= ?";
        const[categories] = await connection.execute(query2,[req.session.user.id]);
        
        res.render('category_has_video', {videos: videos_of_categories,categories, channels})
    }
    else{
        res.redirect('login');
    }

});

categoryRouter.get('/details/:uuid', async function (req, res, next) {
    
    const { uuid } = req.params;
    // check if uuid is private or not, if private dont show.
    const connection = await connectionPool.getConnection();

    const query = "SELECT * FROM category where uuid=?";

    const [category] = await connection.execute(query,[uuid]);
    console.log(category[0].title);
    const query2 = "SELECT * FROM category WHERE user_id= ?";
    const[categories] = await connection.execute(query2,[req.session.user.id]);

    res.render('details_category', {category: category[0] , categories});
});

categoryRouter.get('/delete/:uuid', async function (req, res, next) {
    const { uuid } = req.params;
    const connection = await connectionPool.getConnection();

    const query = "DELETE FROM category WHERE uuid=?";

    const [category] = await connection.execute(query, [uuid]);


    res.redirect('/category');
});

categoryRouter.post('/details/:uuid', async function (req, res, next) {
    if(req.session.user){
        const {uuid} = req.params;
        const { category_title, category_is_private } = req.body;
        const connection = await connectionPool.getConnection();
        console.log("title: ",category_title, "is_private: ", category_is_private);
        const query = "UPDATE category SET title=?, is_private=? WHERE uuid=?";

        const [category] = await connection.execute(query,[category_title, category_is_private, uuid]);
        
        const query2 = "SELECT * FROM category WHERE user_id= ?";
        const[categories] = await connection.execute(query2,[req.session.user.id]);
        console.log(categories);
        res.render('category', {categories: categories, name: req.session.user.name});
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