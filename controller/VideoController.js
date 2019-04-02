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
            const token = JSON.parse(body)
            xiboServices.getLayout(token, layoutId, (body)=>{
                const playlistId = JSON.parse(body).regions[0].playlists[0].playlistId
                xiboServices.postHlsWidget(token, playlistId, sourceUrl, undefined, (body)=>{
                    console.log(body)
                })
            })
        })
    }
}