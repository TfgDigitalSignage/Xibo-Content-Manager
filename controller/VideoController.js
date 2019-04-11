const request = require('request')
const xiboServices = require('../js/httpXiboRequest')

const basicAuth = {
    user: 'adrian',
    password: '1993'
}

module.exports = {
    startStopVideoServer: (url, command, callback) => {
        const authToken = Buffer.from(basicAuth.user+':'+basicAuth.password).toString('base64')
        const options = {
            url: url+command,
            headers: {
                'Authorization': 'Basic ' + authToken
            }
        }
        request.get(options, (err, res, body)=>{
            if (err)
                throw new Error(err)
            callback(body)
        })
    },
    insertHlsWidget: (sourceUrl, layoutId, callback)=>{
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body.access_token
            xiboServices.getLayout(token, layoutId, (response)=>{
                const playlistId = JSON.parse(response.body)[0].regions[0].playlists[0].playlistId
                xiboServices.getWidgetsOfPlaylist(playlistId, token, (resp)=>{
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