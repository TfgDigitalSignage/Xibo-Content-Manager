const path = require('path');
const express = require('express');
const router = express.Router();

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
	const layoutController = require ('../controller/layoutController')
	params.layoutName = req.body.layoutName;
	layoutController.createLayout(params, ()=>{

        });
    res.redirect('/');
});


module.exports = router;
