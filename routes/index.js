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

router.get('/login', async function(req, res, next) {
  res.render('login', {videos: null});
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
