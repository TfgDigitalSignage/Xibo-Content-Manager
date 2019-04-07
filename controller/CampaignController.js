const xiboServices = require('../js/httpXiboRequest')

module.exports = {
    createNameCampaign: (name, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.createNameCampaign(token,name, (body)=>{
                callback(body)
            })
        })
    }
}


/*
                var i = layoutId.length -1
                while (i >= 0){

                	xiboServices.createCampaign(token,campaignId,layoutId[i],layoutOrder[i], (body)=>{
		                console.log('campaign created: ' + body)
		                callback()
	            	})
	            	i--
                }

                */