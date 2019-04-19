const path = require('path');
const express = require('express');
const router = express.Router();
const campaignController = require ('../controller/CampaignController')
const layoutController = require("../controller/layoutController")


let params = {
    campaignName : "",
    campaignId : "",
    layoutsId : [],
    orderLayout : []
}



router.get('/CampaignManager', (req,res,next) => {
    campaignController.getCampaign(params, (campaigns)=>{
            res.render('campaignManager.pug', {
                campaigns: campaigns,
                length: campaigns.length});
        });
   
});

router.post('/createCampaign', (req,res,next) => {
    params.campaignName = req.body.campaignName;
    campaignController.createCampaign(params, ()=>{
            res.redirect('/CampaignManager');
        });
});

router.post('/deleteCampaign', (req, res, next) =>{
    params.campaignId = req.body.campaignId;
    campaignController.deleteCampaign(params, ()=>{
            res.redirect('/CampaignManager');
        });
})
/*
router.post('/createCampaign', (req,res,next) => {
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
*/


module.exports = router;