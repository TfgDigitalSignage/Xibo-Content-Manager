const path = require('path');
const express = require('express');
const router = express.Router();
const layoutController = require ('../controller/layoutController')

let params = {
    layoutName : "",
    layoutId : "",
    layoutBackgroundColor : "",
    layoutBackgroundzIndex : ""
}


router.get('/LayoutManager', (req,res,next) => {
    res.render('layoutManager.pug');
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


module.exports = router;
