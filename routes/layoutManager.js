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
        res.render('cmsFeatures/layoutManager.pug', {
            layouts: layouts,
            length: layouts.length});
        });
});

router.post('/createLayout', (req,res,next) => {
	layoutParams.layoutName = req.body.layoutName;
	layoutController.createLayout(layoutParams, ()=>{
            res.redirect('/LayoutManager');
        });
});

router.post('/deleteLayout', (req,res,next) => {
    layoutParams.layoutId = req.body.layoutId;
    layoutController.deleteLayout(layoutParams, ()=>{
            res.redirect('/LayoutManager');
        });
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
        res.render('cmsFeatures/designLayout.pug', {
            widgets: widgets,
            length: widgets.length});
        });
});


router.post('/addWidget', (req,res,next) =>{
    selectedWidget = req.body
    let requiredParams = []
    if (selectedWidget.selectWidget != 0){
        widgetParams.widgetType = selectedWidget.selectWidget
        switch(widgetParams.widgetType) {
            case 'text':
                requiredParams =[
                    text = "text"
                ];
                break;
            case 'hls':
                requiredParams =[
                    uri = "uri"
                ];
                break;
            case 'localVideo':
                requiredParams =[
                    uri = "uri"
                ];
                break;
            case 'clock':
                requiredParams =[
                    clockTypeId = "clockTypeId"
                ];
                break;
            case 'embedded':
                requiredParams =[
                    embedHtml = "embedHtml"
                ];
                break;
            case 'webpage':
                requiredParams =[
                    uri = "uri",
                    //The mode option for Web page, 1- Open Natively, 2- Manual Position, 3- Best Ft
                    modeId = "modeId"
                ];
                break;
            case 'twitter':
                requiredParams =[
                    searchTerm = "searchTerm",
                    templateId = "templateId"
                ];

                break;
            default:
        } 
        res.render('cmsFeatures/addWidget.pug', {
            type: widgetParams.widgetType,
            params: requiredParams,
            length: requiredParams.length
        });
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
        res.render('cmsFeatures/designLayout.pug', {
            widgets: widgets,
            length: widgets.length});
            });
        });
});


router.post('/deleteWidget', (req,res,next) => {
    rb = JSON.parse(req.body.widgetChecked)
    widgetParams.widgetId = rb.widgetId;
    layoutController.deleteWidget(widgetParams, ()=>{
        layoutController.getWidgets(layoutParams, (widgets)=>{
        res.render('cmsFeatures/designLayout.pug', {
            widgets: widgets,
            length: widgets.length});
        });
    });

});

module.exports = router;