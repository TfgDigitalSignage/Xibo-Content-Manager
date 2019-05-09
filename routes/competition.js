const express = require('express')
const request = require('request')
const router = express.Router()

const competitionController = require('../controller/CompetitionController')
const eventController = require ('../controller/EventController')

let started = 0

let videoServer = ""

//cogemos del archivo de config.

let initLayoutId = 1
let displaysId = 1
let priority = 0
let competitionId = 5


router.get('/', (req,res,next)=>{
    res.render('competition')
})

//Twitter, Imagen Clasificacion, WebPage, WebCamStreaming -> Mismo layout
router.post('/start', (req,res,next)=>{
    if (started === 1){
        return res.end('<h1>Lo sentimos, ya hay un concurso en marcha para hoy</h1>')
    }
    let eventId = ''
    const dateUtil = require('../util/date')
   let startDate = dateUtil.todayISOFormat()
    let endDate = dateUtil.addDaysTodayISOFormat(1)

    const pollFeature = require('../util/pollingFeature')

    //Initialised main event/schedule
    eventController.createEvent(initLayoutId,displaysId,startDate,endDate,priority, (eventId)=>{
        started = 1
        res.end('<h1>Competicion Iniciada. Escuchando cambios en el servidor</h1>')
        pollFeature.pollingRemoteFile(req.body.urlName, (fileChanged)=>{
           const content = JSON.parse(fileChanged)
           for (const layoutId in content){
               if (content.hasOwnProperty(layoutId)){
                    //Provisional: Solo un layout con valor a 1 en el json
                    const item = content[layoutId]
                    if (item.active === 1){
                        const newPrior = item.priority ? item.priority : 0
                        const videoController = require('../controller/VideoController')
                        if (item.type === 'video/hls'){
                            videoServer = item.host
                            videoController.startStopVideoServer(videoServer, 'start-server', (body)=>{
                                videoController.insertHlsWidget(videoServer + 'live/playlist.m3u8', layoutId, (body)=>{
                                    eventController.editEvent(layoutId, eventId, displaysId, startDate, endDate, newPrior, ()=>{
                                        console.log("HLS widget update succesfull")
                                    })
                                })
                            })
                        }
                        else {
                            if (videoServer)
                                videoController.startStopVideoServer(videoServer, "stop-server", body => {
                                    console.log(body)
                                })
                            eventController.editEvent(layoutId,eventId,displaysId,startDate,endDate,newPrior, ()=>{
                                console.log('Evento cambiado con exito(IdLayout = ' + layoutId + ')')
                            })
                        }
                    }
               }
           }
        })
    })
})

router.get('/stop', (req,res,next)=>{
    if (started === 0){
        return res.end('<h1>No hay ningun concurso en marcha</h1>')
    }
    started = 0
    require('../controller/EventController').deleteEvent(eventId, ()=>{
        res.end('<h1>Competicion Cancelada</h1>')
    })
})

router.get('/test', (req,res,next)=>{
    let startDate = dateUtil.todayISOFormat()
    let endDate = dateUtil.addDaysTodayISOFormat(1)
    competitionController.contestFeedListerner(competitionId, event => {
        switch(event.type){
            case 'submissions':
            break;
            case 'judgements':
                if (event.data.judgement_type_id == "AC"){
                    //Poner clasificacion actualizada
                    const scoreboardLayoutId = 10
                    const eventId = 36
                   eventController.editEvent(scoreboardLayoutId, eventId, displaysId, startDate, endDate, priority)
                }
                    
            break;
            default:
            break;
        }
    })
})

router.get('/scoreboard/:competitionId', (req,res,next)=>{
    competitionController.getScoreboard(req.params.competitionId, res);
})

module.exports = router