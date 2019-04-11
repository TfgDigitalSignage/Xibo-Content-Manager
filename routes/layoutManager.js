const path = require('path');
const express = require('express');
const router = express.Router();
const layoutController = require ('../controller/layoutController')

let layoutParams = {
    layoutName : "",
    layoutId : "",
    layoutBackgroundColor : "",
    layoutBackgroundzIndex : "",
    layoutRegion: "",
    layoutPlaylist:""
}
let widgetParams = {
    widgetName : "",
    widgetId: "",
    widgetType: ""
}


router.get('/LayoutManager', (req,res,next) => {
    layoutController.getLayout(layoutParams, (layouts)=>{
        //console.log(layouts);
        res.render('layoutManager.pug', {
            layouts: layouts});
        });
});

router.post('/createLayout', (req,res,next) => {
	layoutParams.layoutName = req.body.layoutName;
	layoutController.createLayout(layoutParams, ()=>{
        });
    res.redirect('/');
});

router.post('/deleteLayout', (req,res,next) => {
    layoutParams.layoutId = req.body.layoutId;
    layoutController.deleteLayout(layoutParams, ()=>{
        });
    res.redirect('/');
});

router.post('/designLayout', (req,res,next) =>{
    selectedLayout = JSON.parse(req.body.layoutChecked)
    layoutParams.layoutId = selectedLayout.layoutId
    layoutParams.layoutName = selectedLayout.layouts
    layoutParams.layoutBackgroundColor = selectedLayout.layoutBackgroundColor
    layoutParams.layoutBackgroundzIndex = selectedLayout.layoutBackgroundzIndex
    layoutParams.layoutRegion = selectedLayout.regions[0]
    layoutParams.layoutPlaylist = selectedLayout.regions[0].playlists[0]
    layoutController.getWidgets(layoutParams, (widgets)=>{
        res.render('designLayout.pug', {
            widgets: widgets,
            length: widgets.length});
        });
});


router.post('/addWidget', (req,res,next) =>{
    selectedWidget = req.body

    if (selectedWidget.selectWidget != 0){
        widgetParams.widgetType = selectedWidget.selectWidget

        switch(widgetParams.widgetType) {
            case 'text':
                
                break;
            case 'hls':
                break;
            case 'localVideo':
                break;
            case 'clock':
                break;
            case 'embed':
                break;
            case 'webpage':
                break;
            default:
        } 
    }
    else
        console.log("Widget not selected")
});

module.exports = router;