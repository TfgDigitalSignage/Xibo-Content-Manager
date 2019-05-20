const util = require('./util/utils')

module.exports = (req,res,next) => {
    if (!req.session.isLoggedIn || req.session.sessionId !== util.getBase64Token(process.env.ACCESS_USERNAME, process.env.ACCESS_PASSWORD))
        return res.redirect('/login');
    next();
}