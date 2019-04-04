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
                    //console.log("Layout creado: " + params.layoutName)
                    params.layoutId = rb.layoutId
                    params.layoutBackgroundColor = rb.layoutBackgroundColor
                    params.layoutBackgroundzIndex = rb.layoutBackgroundzIndex 
                }
                callback()
            })
        })
    },
/*    editEvent: (params, layoutId, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.putSchedule(token, layoutId, params.eventId, params.displaysId, params.startDate, params.endDate, (body)=>{
                console.log('Schedule modified: ' + body)
                callback()
            })
        })
    },
*/
    deleteLayout: (params, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.deleteLayout(token, params.layoutId, (response)=>{
                let rb = JSON.parse(response.body)
                if(rb.error)
                {
                    console.log("ERROR")
                    if (rb.error.code == 404)
                        console.log("Error al borrar el layout: no existe")
                }
                else
                {
                    //console.log("Layout eliminado")
                    params.layoutId = ""
                    params.layoutBackgroundColor = ""
                    params.layoutBackgroundzIndex = ""
                    params.layoutName = ""
                }
                
                callback()
            })
        })
    }

}
