const path = require('path');
const express = require('express');
const router = express.Router();
const layoutController = require ('../controller/layoutController')

let params = {
    layoutName : "",
    layoutId : "",
    layoutBackgroundColor : "",
    layoutBackgroundzIndex : "",
    layoutRegion: "",
    layoutPlaylist:""
}


router.get('/LayoutManager', (req,res,next) => {
    layoutController.getLayout(params, (layouts)=>{
        //console.log(layouts);
        res.render('layoutManager.pug', {
            layouts: layouts});
        });
});

router.post('/createLayout', (req,res,next) => {
	params.layoutName = req.body.layoutName;
	layoutController.createLayout(params, ()=>{
        });
    res.redirect('/');
});

router.post('/deleteLayout', (req,res,next) => {
    params.layoutId = req.body.layoutId;
    layoutController.deleteLayout(params, ()=>{
        });
    res.redirect('/');
});

router.post('/designLayout', (req,res,next) =>{
    selectedLayout = JSON.parse(req.body.layoutChecked)
    params.layoutId = selectedLayout.layoutId
    params.layoutName = selectedLayout.layouts
    params.layoutBackgroundColor = selectedLayout.layoutBackgroundColor
    params.layoutBackgroundzIndex = selectedLayout.layoutBackgroundzIndex
    params.layoutRegion = selectedLayout.regions[0]
    params.layoutPlaylist = selectedLayout.regions[0].playlists[0]
    layoutController.getWidgets(params, (widgets)=>{
        res.render('designLayout.pug', {
            widgets: widgets,
            length: widgets.length});
        });
});


module.exports = router;