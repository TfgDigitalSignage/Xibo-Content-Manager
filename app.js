const express = require('express');
const session = require('express-session')
const body_parser = require('body-parser');
//Read enviroment variables from .env file
require('dotenv').config()

const app = express();
//Change render mode to Pug Template
app.set('view engine', 'pug');
app.set('views', 'view');

const isAuth = require('./auth')

const login_route = require('./routes/login')
const index_route = require('./routes/index');
const scheduleLayout_route = require('./routes/eventManager');
const competition_route = require('./routes/competition')
const layoutManager_route = require('./routes/layoutManager')
const campaignManager_route = require('./routes/campaignManager')

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(express.static('public'))

app.use(login_route)
app.use(isAuth, index_route);
app.use(isAuth, scheduleLayout_route);
app.use('/competition', isAuth, competition_route)
app.use(isAuth, layoutManager_route)
app.use(isAuth, campaignManager_route)


//Not Found page
app.use((req,res,next) => {
    res.status(404).render('notFound');
});


app.listen(3000);


