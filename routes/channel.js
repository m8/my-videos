var express = require('express');
var channelRouter = express.Router();
const ytch = require('yt-channel-info')

channelRouter.get('/:id', async (req, res, next) => {
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

module.exports = channelRouter;