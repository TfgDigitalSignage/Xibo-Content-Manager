const xiboServices = require('../js/httpXiboRequest')




module.exports = {
    createLayout: (params, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.postLayout(token, params.layoutName, (response)=>{
                const rb = JSON.parse(response.body)
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
    getLayout: (params, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.getLayout(token, "", (response)=>{
                const rb = JSON.parse(response.body)
                if(rb.error)
                {
                    console.log("ERROR")
                    //if (rb.error.code == 409)
                        //console.log("Error al crear el layout: nombre ya existente")
                }
                else
                {
                    //console.log("Layout creado: " + params.layoutName)
                }
                callback(rb)
            })
        })
    },
    deleteLayout: (params, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.deleteLayout(token, params.layoutId, (response)=>{
                const rb = JSON.parse(response.body)
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
    },
    getWidgets: (params, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.getWidgetsOfPlaylist(params.layoutPlaylist.playlistId, token, (response) =>{
                const rb = JSON.parse(response.body)
                if(rb.error)
                {
                    console.log("ERROR")
                }
                callback(rb)
            })
        })
    }

}
