const xiboServices = require('../services/xiboServices')

module.exports = {
    createLayout: (params, callback) => {
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.postLayout(token, params.layoutName, (response)=>{
                const rb = JSON.parse(response.body)
                if(rb.error)
                {
                    console.log("ERROR")
                    if (rb.error.code == 409)
                        console.log("Error al crear el layout: nombre ya existente")
                    else if (rb.error.code == 422)
                        console.log("Error al crear el layout: inserta un nombre")
                }
                else
                {
                    //console.log("Layout creado: " + params.layoutName)
                    params.layoutId = rb.layoutId
                    params.layoutBackgroundColor = rb.layoutBackgroundColor
                    params.layoutBackgroundzIndex = rb.layoutBackgroundzIndex 
                }
                callback(rb)
            })
        })
    },
    getLayout: (params, callback) => {
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.getLayout(token, "", (response)=>{
                const rb = JSON.parse(response.body)
                if(rb.error)
                {
                    console.log("ERROR")
                }
                else
                {
                    
                }
                callback(rb)
            })
        })
    },
    deleteLayout: (params, callback) => {
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.deleteLayout(token, params.layoutId, (body)=>{
                if(body){
                    const rb = JSON.parse(body)
                    if(rb.error)
                    {
                        console.log("ERROR")
                        if (rb.error.code == 404)
                            console.log("Error al borrar el layout: no existe")
                    } 
                }
                else
                {
                    //console.log("Layout eliminado")
                    params.layoutId = ""
                    params.layoutBackgroundColor = ""
                    params.layoutBackgroundzIndex = ""
                    params.layoutName = ""
                }
                callback(body)
            })
        })
    },
    getWidgets: (params, callback) => {
        xiboServices.getAccessToken((body)=>{
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
        xiboServices.getAccessToken((body)=>{
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
        xiboServices.getAccessToken((body)=>{
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
    editSubmissionFeed: (params, callback) => {
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.getLayout(token, params.layoutId, response=>{
                const playlistId = JSON.parse(response.body)[0].regions[1].playlists[0].playlistId
                xiboServices.getWidgetsOfPlaylist(token, playlistId, resp=>{
                    const widgets = JSON.parse(resp.body)
                    if (widgets.length == 0){
                        xiboServices.postWidgetWebContent(playlistId, token, params.uri, 1, 0, 0, body=>{
                            callback(body)
                        })
                    }
                    else {
                        xiboServices.deleteWidget(token, widgets[0].widgetId, ()=>{
                            xiboServices.postWidgetWebContent(playlistId, token, params.uri, 1, 1, 10, body=>{
                                callback(body)
                            })
                        })
                    }
                })
            })
        })
    },
    createWebPageWidgetDummy: (playlistId, uri, callback) => {
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.postWidgetWebContent(playlistId, token, uri, 1, 1, 10, (res, widget) => {
                callback(widget)
            })
        })
    }
}
