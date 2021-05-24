let express = require('express');
let channelRouter = express.Router();
let connectionPool = require('../db/conn');
let ytch = require('yt-channel-info')

channelRouter.get('/:id', async (req, res, next) => {
  if(req.session.user){
    
    const connection = await connectionPool.getConnection();

    const { id } = req.params;
    channelId = id;
    const query2 = "SELECT * FROM category WHERE user_id= ?";
    const[categories] = await connection.execute(query2,[req.session.user.id]);

    ytch.getChannelInfo(channelId, 0).then((response) => {
      
      ytch.getChannelVideos(channelId, 'newest', String).then((response2) => {
        // console.log(response)
        console.log(response2)
        res.render('channel',{source: response, videos: response2.items, categories})
      }).catch((err) => {
        console.log(err)
      })
      
    }).catch((err) => {
      console.log(err)
    })
  }
  else{
    res.redirect('/')  
  }
  })

module.exports = channelRouter;