const xiboServices = require('../js/httpXiboRequest')

module.exports = {
    createCampaign: (name, campaignId, layoutId,callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.createNameCampaign(token,name, (body)=>{
                campaignId = JSON.parse(body).campaignId
                var i = layoutId.length -1
                while (i >= 0){
                	xiboServices.createCampaign(token,campaignId,layoutId[i],layoutOrder[i], (body)=>{
		                console.log('campaign created: ' + body)
		                callback()
	            	})
	            	i--
                }

            })
        })
    }
}