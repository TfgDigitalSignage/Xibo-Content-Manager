const path = require('path');
const express = require('express');
const layoutController = require("../controller/layoutController")
const router = express.Router();
let layoutManager = require("./layoutManager")
const root = path.dirname(require.main.filename);
const remoteContent_path = path.join(root, 'view', 'LayoutScheduler.pug');
const eventController = require("../controller/EventController")
router.get('/LayoutScheduler', (req,res,next) => {
    layoutController.getLayout(layoutManager.layoutParams, (layouts)=>{

           res.render('LayoutScheduler.pug', {
                layouts: layouts,
                lengthLayouts: layouts.length
            });
    });
});

router.post('/LayoutScheduler/createEvent', (req,res,next) => {
    const body = req.body;
    console.log(body)
    const dateIni = body.fromDate.replace('T',' ') + ':00'
    const dateFin = body.Totote.replace('T',' ') + ':00'
    selectedCampaign = JSON.parse(req.body.layoutChecked)
    console.log(dateIni)
    eventController.createEvent(selectedCampaign.layoutId,"1",dateIni,dateFin,body.priority,(idEvent)=>{
        console.log(idEvent)
        });
});

/**
 * Fetch Media data from Xibo Cms Library to show every avaliable item on schedule form
 */
function getMediaItems(callback){

    //Fetch data from xibo
    const services = require('../js/httpXiboRequest');
    services.xibo_getAccessToken((body) => {
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