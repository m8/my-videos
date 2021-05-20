var express = require('express');
var router = express.Router();
var connectionPool = require('../db/conn');

/* GET home page. */
router.get('/', async function(req, res, next) {
  if(req.session.user){
    
    const connection = await connectionPool.getConnection();    
    const query = "SELECT * FROM (SELECT * FROM user_has_video WHERE user_id = ?) AS W JOIN video on W.video_id = video.id ";
    const [videos] = await connection.execute(query, [req.session.user.id]);
    
    res.render('index', {name: req.session.user.name, videos});
  }
  else{
    res.redirect('login');
  }
});

router.post('/add-video', async function(req, res, next) {
  if(req.session.user){

    let { video_url, video_name } = req.body;
    const connection = await connectionPool.getConnection();

    const query = "SELECT * FROM video where url=?";
    const [videos] = await connection.execute(query, [video_url]);

    if(videos.length == 0){
      const query = "INSERT INTO video (url,name,source) VALUES(?,?,?)"
      const [rows] = await connection.execute(query, [video_url,video_name,"youtube"])

      const query2 = "INSERT INTO user_has_video (user_id,video_id,notes,rating) VALUES(?,?,?,?)"
      const [rows2] = await connection.execute(query2, [req.session.user.id, rows.insertedId, "",5])
    }
    else{
      const query3 = "INSERT INTO user_has_video (user_id,video_id,notes,rating) VALUES(?,?,?,?)"
      const [rows3] = await connection.execute(query3, [req.session.user.id, videos[0].id ,"",5])
    }

    // const query = "SELECT * FROM (SELECT * FROM user_has_video WHERE user_id = ?) AS W JOIN video on W.video_id = video.id ";
    // const [videos] = await connection.execute(query, [req.session.user.id]);
    
    res.redirect('/');
  }
  else{
    res.redirect('login');
  }
});

router.get('/login', async function(req, res, next) {
  res.render('login', {videos: null});
});

router.get('/details/:id', async function(req, res, next) {
  const { id } = req.params;
  const connection = await connectionPool.getConnection();

  const query = "SELECT * FROM user_has_video where user_id=? and video_id=?";
  const query2 = "SELECT * FROM video where id=?";

  const [videos] = await connection.execute(query, [req.session.user.id, id]);
  const [video] = await connection.execute(query2, [id]);

  res.render('details', {video: videos[0], vs: video[0]});
});

router.post('/details/:id', async function(req, res, next) {
  const { id } = req.params;
  const { notes, rating } = req.body;

  const connection = await connectionPool.getConnection();

  const query = "UPDATE user_has_video set notes=?, rating=? where user_id=? and video_id=?;";

  const [videos] = await connection.execute(query, [notes,rating,req.session.user.id,id]);

  res.redirect('/');
});

router.post('/login', async function(req,res,next){

  const connection = await connectionPool.getConnection();
  
  const { username, password } = req.body;
  const query = "SELECT * FROM user WHERE username=? and password=?";
  const [row] = await connection.execute(query, [username,password]);
  
  if(row != null){
    req.session.user = row[0];
    res.redirect('/')
  }else{
    res.render('login', {videos: null});
  }
})




module.exports = router;
