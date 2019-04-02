const xiboServices = require('../js/httpXiboRequest')

module.exports = {
    createEvent: (params, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.postSchedule(token, params.initLayoutId, params.displaysId, params.startDate, params.endDate, (body)=>{
                console.log('Schedule created: ' + body)
                params.eventId = JSON.parse(body).eventId
                callback()
            })
        })
    },
    editEvent: (params, layoutId, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.putSchedule(token, layoutId, params.eventId, params.displaysId, params.startDate, params.endDate, (body)=>{
                console.log('Schedule modified: ' + body)
                callback()
            })
        })
    },
    deleteEvent: (params, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.deleteSchedule(token, params.eventId, (body)=>{
                console.log('Schedule removed: ' + body)
                params.eventId = ''
                callback()
            })
        })
    }
}
