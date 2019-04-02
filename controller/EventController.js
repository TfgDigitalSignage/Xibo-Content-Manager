const xiboServices = require('../js/httpXiboRequest')

module.exports = {
    createEvent: (eventId,layoutId, displayGroupIds, fromDt, toDt,priority, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.postSchedule(token,layoutId, displayGroupIds, fromDt, toDt,priority, (body)=>{
                console.log('Schedule created: ' + body)
                eventId = JSON.parse(body).eventId
                callback()
            })
        })
    },
    editEvent: (idLayout,idEvent,displayGroupIds,fromDt, toDt,priority, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.putSchedule(token, idLayout,idEvent,displayGroupIds,fromDt, toDt,priority, (body)=>{
                console.log('Schedule modified: ' + body)
                callback()
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
    }
}
