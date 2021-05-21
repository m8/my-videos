var express = require('express');
var channelRouter = express.Router();
const ytch = require('yt-channel-info')

channelRouter.get('/:id', async (req, res, next) => {
    const channelId = req.params.id;
    console.log("channelId", channelId)

    ytch.getChannelInfo(channelId, 0).then((response) => {
        console.log(response)
    }).catch((err) => {
        console.log(err)
    })

})

module.exports = channelRouter;