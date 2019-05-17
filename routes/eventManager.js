const path = require('path');
const express = require('express');
const router = express.Router();
const root = path.dirname(require.main.filename);

const layoutController = require("../controller/layoutController")
let layoutManager = require("./layoutManager")
const campaignController = require("../controller/CampaignController")
let campaignManager = require("./campaignManager")
const remoteContent_path = path.join(root, 'view', 'eventManager.pug');
const eventController = require("../controller/EventController")

let params = {
    //Obligatorios
    eventTypeId : 1, //1=Campaign, 2=Command, 3=Overlay
    displayOrder : "",
    isPriority : "", 
    displayGroupIds : 2, //Id de las pantallas, o grupos de pantallas, en los que programar el evento.
    fromDt : "",
    //Opcionales
    toDt : "", 
    campaignId : "",
    eventId : ""
}

router.get('/EventManager', (req,res,next) => {
    layoutController.getLayout(layoutManager.layoutParams, (layouts)=>{
        campaignController.getCampaign(campaignManager.params, (campaigns)=>{
            eventController.getEvent(params, (events) => {
                res.render('eventManager.pug', {
                layouts: layouts,
                lengthLayouts: layouts.length,
                campaigns: campaigns,
                lengthCampaigns: campaigns.length,
                events: events,
                lengthEvents: events.length
                });
            });
        });
    });
});

router.post('/createEvent', (req,res,next) => {
    selectedCampaign = JSON.parse(req.body.layoutChecked)
    params.campaignId = selectedCampaign.campaignId
    params.displayOrder = JSON.parse(req.body.order)
    params.isPriority = JSON.parse(req.body.priority)
    params.fromDt = req.body.fromDate.replace('T',' ') + ':00'
    params.toDt = req.body.toDate.replace('T',' ') + ':00'
    eventController.createEvent(params,(idEvent)=>{
            res.redirect('/EventManaget');
        });
});

router.post('/deleteEvent', (req, res, next) =>{
    params.eventId = req.body.eventId;
    eventController.deleteEvent(params, ()=>{
            res.redirect('/EventManager');
        });
});

/**
 * Fetch Media data from Xibo Cms Library to show every avaliable item on schedule form
 */
function getMediaItems(callback){

    //Fetch data from xibo
    const services = require('../js/httpXiboRequest');
    services.getAccessToken((body) => {
      const access_token = body['access_token'];
      services.getLibraryMedia(access_token, (resp, body) => {
        const items = JSON.parse(body);
        callback && callback(items);      
      });
    });
}

function createLayoutInitialized(params, callback){
    //Create and fill Xibo Layout
}

module.exports = router;