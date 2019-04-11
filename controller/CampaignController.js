const xiboServices = require('../js/httpXiboRequest')

module.exports = {
    createNameCampaign: (name, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
            const token = body['access_token'];
            xiboServices.createNameCampaign(token,name, (body)=>{
                callback(body)
            })
        })
    },
    	// a veces solo mete uno, en el menor de los casos
     createCampaign: (campaignId,layoutId,layoutOrder, callback) => {
        xiboServices.xibo_getAccessToken((body)=>{
        const token = body['access_token'];
   		var i = layoutId.length -1
   		console.log(i)
         while (i >= 0){
         	console.log(layoutId[i])
			xiboServices.createCampaign(token,campaignId,layoutId[i],layoutOrder[i],i, (body)=>{
		                callback()
	            	})
	            i--
             }
        })
    }
}

