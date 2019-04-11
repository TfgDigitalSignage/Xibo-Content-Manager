const xiboServices = require('../js/httpXiboRequest')

module.exports = {
    createEvent: (layoutId, displayGroupIds, fromDt, toDt,priority, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.postSchedule(token,layoutId, displayGroupIds, fromDt, toDt,priority, (body)=>{
                const eventId = JSON.parse(body).eventId
                callback(eventId)
            })
        })
    },
    editEvent: (idLayout,idEvent,displayGroupIds,fromDt, toDt,priority, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.putSchedule(token, idLayout,idEvent,displayGroupIds,fromDt, toDt,priority, (body)=>{
                console.log('Schedule modified: ' + body)
                callback(body)
            })
        })
    },
    deleteEvent: (eventId, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.deleteSchedule(token, eventId, (body)=>{
                console.log('Schedule removed: ' + body)
                eventId = ''
                callback()
            })
        })
    },
}
