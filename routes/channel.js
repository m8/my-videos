var express = require('express');
var channelRouter = express.Router();
const ytch = require('yt-channel-info')

channelRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    console.log("channelId", id)
    channelId = id;
    ytch.getChannelInfo(channelId, 0).then((response) => {

        ytch.getChannelVideos(channelId, 'newest', String).then((response2) => {
            // console.log(response)
            console.log(response2)
            res.render('channel',{source: response, videos: response2.items})
          }).catch((err) => {
            console.log(err)
          })
      
    }).catch((err) => {
        console.log(err)
    })
    
})

module.exports = channelRouter;