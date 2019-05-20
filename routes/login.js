const express = require('express');
const router = express.Router();

const util = require('../util/utils')

router.get('/login', (req,res,next)=>{
    res.render('login')
})

router.post('/login', (req,res,next)=>{
    const username = process.env.ACCESS_USERNAME
    const password = process.env.ACCESS_PASSWORD
    if (req.body.username !== username || req.body.password !== password)
        return res.redirect('/login')
    req.session.isLoggedIn = true
    req.session.sessionId = util.getBase64Token(username, password)
    res.redirect('/')
})

module.exports = router;