const path = require('path');
const express = require('express');
const router = express.Router();
const layoutController = require("../controller/layoutController")


let params = {
    CampaignName : "",
    CampaignId : "",
    layoutId : [],
    orderLayout : []
}



router.get('/createCampaign', (req,res,next) => {
    layoutController.getLayout(layoutController.params, (layouts)=>{
            //console.log(layouts);
            res.render('createCampaign.pug', {
                layouts: layouts});
        });
   
});


router.post('/createCampaign', (req,res,next) => {
	const campaignController = require ('../controller/CampaignController')
	params.CampaignName = req.body.CampaignName;
	campaignController.createNameCampaign(params.CampaignName, (body)=>{
            params.layoutId = req.body.layoutId
            let aux = []
            console.log(req.body)
            for (const i in req.body.layoutId){
               
                aux.push(
               
                    req.body['order_' + req.body.layoutId[i]]
                );
            }
        params.orderLayout = aux
        console.log(params.layoutId)
        console.log(params.orderLayout)
		params.CampaignId = JSON.parse(body).campaignId
		campaignController.createCampaign(params.CampaignId,params.layoutId,params.orderLayout, (body)=>{

             
        	});
        });

    res.redirect('/');
});


module.exports = router;