const express = require('express')
const router = express.Router()

let started = 0



//cogemos del archivo de config.
let initLayoutId = 1
let displaysId = 1
let priority = 0

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

    const eventController = require ('../controller/EventController')
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
                        if (item.type === 'video/hls'){
                            const videoController = require('../controller/VideoController')
                            videoController.startStopVideoServer(item.host, 'start-server', (body)=>{
                                videoController.insertHlsWidget(item.host + 'live/playlist.m3u8', layoutId, (body)=>{
                                    eventController.editEvent(layoutId, eventId, displaysId, startDate, endDate, newPrior, ()=>{
                                        console.log("HLS widget update succesfull")
                                    })
                                })
                            })
                        }
                        else {
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

module.exports = router