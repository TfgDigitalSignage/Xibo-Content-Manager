const xiboServices = require('../services/xiboServices')

module.exports = {
    createCampaign: (params, callback) => {
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.createCampaign(token, params.campaignName, (body)=>{
                console.log(body)
                const rb = JSON.parse(body)
                if(rb.error)
                {
                    console.log("ERROR")
                    if (rb.error.code == 422)
                        console.log("Error al crear la campaña: inserta un nombre")
                }
                else
                {
                    params.campaignId = rb.campaignId
                }
                callback()
            })
        })
    },
    getCampaign: (params, callback) => {
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.getCampaign(token, "", (body)=>{
                //console.log(body)
                const rb = JSON.parse(body)
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
    deleteCampaign: (params, callback) => {
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.deleteCampaign(token, params.campaignId, (body)=>{
                if(body != ""){
                    const rb = JSON.parse(body)
                    if(rb.error)
                    {
                        console.log("ERROR")
                        if (rb.error.code == 404)
                            console.log("Error al borrar la campaña: no existe")
                    } 
                }
                else
                {
                    params.campaignId = ""
                    params.campaignName = ""
                }
                callback()
            })
        })
    },
    addLayoutToCampaign: (params, callback) =>{
        xiboServices.getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.addLayoutToCampaign(token, params.campaignId, params.layoutsId[0], params.orderLayout[0], (body)=>{
                //console.log(body)
                callback()
            })
        })
    }

}

