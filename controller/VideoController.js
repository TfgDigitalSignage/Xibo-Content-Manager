const request = require('request')
const xiboServices = require('../services/xiboServices')
const base64Encoder = require('../util/utils').getBase64Token

module.exports = {
    startStopVideoServer: (url, command, username, password, callback) => {
        const options = {
            url: url+command,
            headers: {
                'Authorization': 'Basic ' + base64Encoder(username, password)
            }
        }
        request.get(options, (err, res, body)=>{
            if (err || res.statusCode > 400)
                console.log(err)
            callback(body)
        })
    },
    insertHlsWidget: (sourceUrl, layoutId, callback)=>{
        xiboServices.getAccessToken((body)=>{
            const token = body.access_token
            xiboServices.getLayout(token, layoutId, (response)=>{
                const playlistId = JSON.parse(response.body)[0].regions[0].playlists[0].playlistId
                xiboServices.getWidgetsOfPlaylist(token, playlistId, (resp)=>{
                    const widgets = JSON.parse(resp.body)
                    if (widgets.length == 0){
                        xiboServices.postHlsWidget(token, playlistId, sourceUrl, 0, 0, body=>{
                            callback(body)
                        })
                    }
                    else {
                        xiboServices.editHlsWidget(token, widgets[0].widgetId, sourceUrl, 0, 0, body=> {
                            callback(body)
                        })
                    }
                })
            })
        })
    }
}