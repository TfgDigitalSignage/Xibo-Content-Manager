const xiboServices = require('../services/xiboServices')

module.exports = {
    createLayout: (params, callback) => {
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.postLayout(token, params.layoutName, params.templateId, (response)=>{
                const rb = JSON.parse(response.body)
                if(rb.error)
                {
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
                    params.widgetId = ""
                    params.widgetName = ""
                    params.widgetType = ""
                }
                
                callback()
            })
        })
    },
    editSubmissionFeed: (widgetId, url, callback) => {
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.putWidgetWebContent(widgetId, token, url, 3, 0, 0, widget=>{
                if (widget.error)
                    callback(widget.error)
                callback(widget)
            })
        })
    },
    createWebPageWidgetDummy: (playlistId, uri, callback) => {
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.postWidgetWebContent(playlistId, token, uri, 3, 1, 10, (res, widget) => {
                callback(widget)
            })
        })
    },

    addTwitterRegionToLayout: (layoutId, callback) =>{
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.addRegion(token, layoutId, 482, 5, 312, 590, (region) => {
                const regionInfo = JSON.parse(region)
                callback(regionInfo)
            })
        })
    }/*,

    getContestTemplate: callback => {
        xiboServices.getAccessToken(body => {
            const token = body['access_token'];
            xiboServices.getTemplates(token, templateList => {
                if (!templateList)
                    callback("");
                const list = JSON.parse(templateList)
                list.forEach(item => {
                    if (item.layout === "CompetitionLayoutTemplate"){
                        callback(item.layoutId)
                    }
                });
            })
        }) 
    }*/
}
