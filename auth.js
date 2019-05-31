const util = require('./util/utils')

module.exports = (req,res,next) => {
    const qs = req.query;
    if (qs.user && qs.user === process.env.ACCESS_USERNAME && qs.pass && qs.pass === process.env.ACCESS_PASSWORD){
        return next()
    }
    if (!req.session.isLoggedIn || req.session.sessionId !== util.getBase64Token(process.env.ACCESS_USERNAME, process.env.ACCESS_PASSWORD))
        return res.redirect('/login');
    next();
}