let express = require('express');
let channelRouter = express.Router();
let connectionPool = require('../db/conn');
let ytch = require('yt-channel-info')

channelRouter.get('/:id', async (req, res, next) => {
  if (req.session.user) {

    const connection = await connectionPool.getConnection();

    const { id } = req.params;
    channelId = id;
    const query2 = "SELECT * FROM category WHERE user_id= ?";
    const [categories] = await connection.execute(query2, [req.session.user.id]);

    const query3 = "SELECT * FROM channel WHERE url= ?";
    const [channel] = await connection.execute(query3, [id]);

    console.log(channel);


    ytch.getChannelInfo(channelId, 0).then((response) => {

      ytch.getChannelVideos(channelId, 'newest', String).then((response2) => {
        // console.log(response)
        res.render('channel_has_video', { source: response, videos: response2.items, categories, channel: channel[0]})
      }).catch((err) => {
        console.log(err)
      })

    }).catch((err) => {
      console.log(err)
    })
  }
  else {
    res.redirect('/')
  }
})


channelRouter.get('/delete/:id', async (req, res, next) => {
  if (req.session.user) {

    const connection = await connectionPool.getConnection();

    const { id } = req.params;

    const query1 = "SELECT * FROM channel WHERE url=?";
    const [channel] = await connection.execute(query1, [id]);

    const query2 = "DELETE FROM user_follows_channel WHERE user_id= ? and channel_id=?";
    const [re] = await connection.execute(query2, [req.session.user.id, channel[0].id]);
    res.redirect('/channels');
  }
  else {
    res.redirect('/')
  }
})


channelRouter.post('/add', async function (req, res, next) {
  if (req.session.user) {

      let { channel_url, name } = req.body;
      console.log("Channel_url", channel_url)
      const connection = await connectionPool.getConnection();

      const query = "SELECT * FROM channel WHERE url=?";
      const [channels] = await connection.execute(query, [channel_url]);
      console.log("channels", channels)


      let channel_details;

      await ytch.getChannelInfo(channel_url, 0).then((response) => {
        channel_details = response;
        console.log(channel_details);
      })

    


      if (channels.length == 0) {
          const query3 = "INSERT INTO channel (url,name,img_url) VALUES(?,?,?)"
          const [rows] = await connection.execute(query3, [channel_url, channel_details.author, channel_details.authorThumbnails[0].url])

          console.log("Inserted into channel")

          const query2 = "INSERT INTO user_follows_channel (user_id,channel_id,since) VALUES(?, ?, ?)"
          const [rows2] = await connection.execute(query2, [req.session.user.id, rows.insertId, new Date()])
          console.log("Inserted into user_follows_channel")
      }
      else {

          const query3 = "Select * from user_follows_channel,channel where user_follows_channel.channel_id=channel.id and channel.url = ? "
          const [ss] = await connection.execute(query3, [channel_url])

          if(ss.length == 0){
            const query3 = "INSERT INTO user_follows_channel (user_id,channel_id,since) VALUES(?, ?, ?)"
            const [rows3] = await connection.execute(query3, [req.session.user.id, channels[0].id, new Date()])
          }
      }

      res.redirect('/channels');
  }
  else {
      res.redirect('login');
  }
});




module.exports = channelRouter;