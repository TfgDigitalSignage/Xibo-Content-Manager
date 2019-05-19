const express = require('express');
const body_parser = require('body-parser');
//Read enviroment variables from .env file
require('dotenv').config()

const app = express();
//Change render mode to Pug Template
app.set('view engine', 'pug');
app.set('views', 'view');

const index_route = require('./routes/index');
const remoteContent_route = require('./routes/remoteDataLoader'); 
const scheduleLayout_route = require('./routes/eventManager');
const polling_route = require('./routes/polling');
const competition_route = require('./routes/competition')
const layoutManager_route = require('./routes/layoutManager')
const campaignManager_route = require('./routes/campaignManager')

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));

app.use(express.static('public'))

app.use(index_route);
app.use(remoteContent_route);
app.use(scheduleLayout_route);
app.use(polling_route);
app.use('/competition', competition_route)
app.use(layoutManager_route)
app.use(campaignManager_route)

//Not Found page
app.use((req,res,next) => {
    res.status(404).render('notFound');
});


app.listen(3000);


