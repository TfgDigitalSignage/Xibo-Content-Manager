const xiboServices = require('../js/httpXiboRequest')




module.exports = {
    createLayout: (params, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.postLayout(token, params.layoutName, (response)=>{
                let rb = JSON.parse(response.body)
                if(rb.error)
                {
                    console.log("ERROR")
                    if (rb.error.code == 409)
                        console.log("Error al crear el layout: nombre ya existente")
                }
                else
                {
                    console.log('Layout created: ' + params.layoutName)
                    params.layoutId = JSON.parse(body).layoutId
                    params.layoutBackgroundColor = JSON.parse(body).layoutBackgroundColor
                    params.layoutBackgroundzIndex = JSON.parse(body).layoutBackgroundzIndex 
                }
                callback()
            })
        })
    }//,
/*    editEvent: (params, layoutId, callback) => {
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
*/
}
