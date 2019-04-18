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
    res.redirect('/LayoutManager');
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
                let requiredParams =[
                    text = "text"
                ];
                res.render('addWidget.pug', {
                    type: widgetParams.widgetType,
                    params: requiredParams,
                    length: requiredParams.length
                });
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

router.post('/postWidget', (req,res,next) =>{
    const preParams = req.body
    keys = Object.keys(preParams) 
    values = Object.values(preParams)
    let requiredParams = []
    for(let i=0; i<keys.length; i++){
        requiredParams.push({
            key: keys[i],
            value: values[i]
        });
    }
    layoutController.addWidget(widgetParams, layoutParams, requiredParams, ()=>{
        layoutController.getWidgets(layoutParams, (widgets)=>{
        res.render('designLayout.pug', {
            widgets: widgets,
            length: widgets.length});
            });
        });
});


router.post('/deleteWidget', (req,res,next) => {
    rb = JSON.parse(req.body.widgetChecked)
    widgetParams.widgetId = rb.widgetId;
    layoutController.deleteWidget(widgetParams, ()=>{
        });
    res.redirect('/designLayout');
});

module.exports = router;