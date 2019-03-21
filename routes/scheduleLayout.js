const path = require('path');
const express = require('express');

const router = express.Router();

const root = path.dirname(require.main.filename);
const remoteContent_path = path.join(root, 'view', 'LayoutScheduler.pug');

router.get('/LayoutScheduler', (req,res,next) => {
    getMediaItems((items) => {
        res.render(remoteContent_path, {
            items: items});
    });
});

router.post('/LayoutScheduler/createLayout/', (req,res,next) => {
    const body = req.body;
    const params = [];
    for (const i in body.id){
        const key = 'order_' + body.id[i];
        params.push({
            id: body.id[i],
            order: body[key]
        });
    }
    createLayoutInitialized(params, ()=>{

    })
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