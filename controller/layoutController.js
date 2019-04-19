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
            xiboServices.getWidgetsOfPlaylist(token, params.layoutPlaylist.playlistId, (response) =>{
                const rb = JSON.parse(response.body)
                if(rb.error)
                {
                    console.log("ERROR")
                }
                callback(rb)
            })
        })
    },
    addWidget: (widgetParams, layoutParams, requiredParams, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            switch(widgetParams.widgetType) {
                case 'text':
                    xiboServices.addTextWidget(token, widgetParams.widgetType, layoutParams.layoutPlaylist.playlistId, requiredParams[0].value, (body) =>{
                        const rb = JSON.parse(body)
                        if(rb.error)
                        {
                            console.log("ERROR")
                        }
                        else{
                            //console.log("Widget creado: " )
                            //widgetParams.widgetName = rb.layoutId
                            //widgetParams.widgetId = rb.layoutBackgroundColor 
                        }
                        callback(rb)
                    });
                    break;
                case 'hls':
                    xiboServices.addHlsWidget(token, widgetParams.widgetType, layoutParams.layoutPlaylist.playlistId, requiredParams[0].value, (body) =>{
                        const rb = JSON.parse(body)
                        if(rb.error)
                        {
                            console.log("ERROR")
                        }
                        else{
                            //console.log("Widget creado: " )
                            //widgetParams.widgetName = rb.layoutId
                            //widgetParams.widgetId = rb.layoutBackgroundColor 
                        }
                        callback(rb)
                    });
                    break;
                case 'localVideo':
                        xiboServices.addLocalVideoWidget(token, widgetParams.widgetType, layoutParams.layoutPlaylist.playlistId, requiredParams[0].value, (body) =>{
                        const rb = JSON.parse(body)
                        if(rb.error)
                        {
                            console.log("ERROR")
                        }
                        else{
                            //console.log("Widget creado: " )
                            //widgetParams.widgetName = rb.layoutId
                            //widgetParams.widgetId = rb.layoutBackgroundColor 
                        }
                        callback(rb)
                    });
                    break;
                case 'clock':
                    xiboServices.addLocalVideoWidget(token, widgetParams.widgetType, layoutParams.layoutPlaylist.playlistId, requiredParams[0].value, (body) =>{
                        const rb = JSON.parse(body)
                        if(rb.error)
                        {
                            console.log("ERROR")
                        }
                        else{
                            //console.log("Widget creado: " )
                            //widgetParams.widgetName = rb.layoutId
                            //widgetParams.widgetId = rb.layoutBackgroundColor 
                        }
                        callback(rb)
                    });
                    break;
                case 'embedded':
                    xiboServices.addLocalVideoWidget(token, widgetParams.widgetType, layoutParams.layoutPlaylist.playlistId, requiredParams[0].value, (body) =>{
                        const rb = JSON.parse(body)
                        if(rb.error)
                        {
                            console.log("ERROR")
                        }
                        else{
                            //console.log("Widget creado: " )
                            //widgetParams.widgetName = rb.layoutId
                            //widgetParams.widgetId = rb.layoutBackgroundColor 
                        }
                        callback(rb)
                    });
                    break;
                case 'webpage':
                    xiboServices.addWebpageWidget(token, widgetParams.widgetType, layoutParams.layoutPlaylist.playlistId, requiredParams[0].value, requiredParams[1].value, (body) =>{
                        const rb = JSON.parse(body)
                        if(rb.error)
                        {
                            console.log("ERROR")
                        }
                        else{
                            //console.log("Widget creado: " )
                            //widgetParams.widgetName = rb.layoutId
                            //widgetParams.widgetId = rb.layoutBackgroundColor 
                        }
                        callback(rb)
                    });
                    break;
                case 'twitter':
                    xiboServices.addTwitterWidget(token, widgetParams.widgetType, layoutParams.layoutPlaylist.playlistId, requiredParams[0].value, requiredParams[1].value, (body) =>{
                        const rb = JSON.parse(body)
                        if(rb.error)
                        {
                            console.log("ERROR")
                        }
                        else{
                            //console.log("Widget creado: " )
                            //widgetParams.widgetName = rb.layoutId
                            //widgetParams.widgetId = rb.layoutBackgroundColor 
                        }
                        callback(rb)
                    });
                    break;
                default:
            } 
        })
    },
    deleteWidget: (params, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.deleteWidget(token, params.widgetId, (body)=>{
                const rb = JSON.parse(body)
                if(rb.error)
                {
                    console.log("ERROR")
                    if (rb.error.code == 404)
                        console.log("Error al borrar el widget: no existe")
                }
                else
                {
                    //console.log("Widget eliminado")
                    params.widgetId = ""
                    params.widgetName = ""
                    params.widgetType = ""
                }
                
                callback()
            })
        })
    },

}
