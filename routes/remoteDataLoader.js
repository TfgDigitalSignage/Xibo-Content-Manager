const path = require('path');
const express = require('express');

const router = express.Router();

const root = path.dirname(require.main.filename);
const remoteContent_path = path.join(root, 'view', 'RemoteContent.pug');

router.get('/RemoteContent', (req,res,next) => {
    res.render(remoteContent_path);
    next();
});

router.post('/getRemoteData', (req,res,next) => {
    res.redirect('/');
});

module.exports = router;