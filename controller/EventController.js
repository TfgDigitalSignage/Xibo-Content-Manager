const xiboServices = require('../services/xiboServices')

module.exports = {
    createEvent: (params, callback) => {
        
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.postSchedule(token,params.campaignId, params.displayGroupIds, params.fromDt, params.toDt, params.isPriority, params.displayOrder, params.eventTypeId, (body)=>{
                params.eventId = JSON.parse(body).eventId
                callback(body)
            })
        })
    },
    editEvent: (idLayout,idEvent,displayGroupIds,fromDt, toDt,priority, callback) => {
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.putSchedule(token, idLayout,idEvent,displayGroupIds,fromDt, toDt,priority, (body)=>{
                console.log('Schedule modified: ' + body)
                callback(body)
            })
        })
    },
    deleteEvent: (params, callback) => {
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.deleteSchedule(token, params.eventId, (body)=>{
                if(body != ""){
                    const rb = JSON.parse(body)
                    if(rb.error)
                    {
                        console.log("ERROR")
                        if (rb.error.code == 404)
                            console.log("Error al borrar el evento: no existe")
                    } 
                }
                else
                {
                    params.eventId = ""
                }
                callback()
            })
        })
    },
    getEvent:   (params, callback) => {
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            var nowTime = require('../util/date').todayISOFormat()
            xiboServices.getSchedule(token, params.displayGroupIds, nowTime, (body)=>{
                const rb = JSON.parse(body).events
                callback(rb)
            })
        })
    },
}
