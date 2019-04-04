const path = require('path');
const express = require('express');
const router = express.Router();


let params = {
    CampaignName : "",
    CampaignId : ""
}


router.get('/createCampaign', (req,res,next) => {
    res.render('createCampaign.pug');
});

router.post('/createCampaign', (req,res,next) => {
	const campaignController = require ('../controller/CampaignController')
	params.CampaignName = req.body.CampaignName;
	console.log(params.CampaignName)
	campaignController.createNameCampaign(params.CampaignName, (body)=>{
			params.CampaignId = JSON.parse(body).campaignId
			console.log(params.campaignId)
        });
    res.redirect('/');
});

module.exports = router;