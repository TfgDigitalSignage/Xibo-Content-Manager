const path = require('path');
const express = require('express');

const router = express.Router();

router.get('/Polling', (req,res,next) => {
    res.render('Polling.pug');
});

router.get('/pollingLocalFile', (req,res,next) => {
	require('../util/pollingFeature').pollingLocalFile();
    res.redirect('/');
});

router.post('/pollingRemoteFile', (req,res,next) => {
	require('../util/pollingFeature').pollingRemoteFile(req.body.urlName, (file)=>{
		console.log(file)
	});
    res.redirect('/');
});


module.exports = router;
