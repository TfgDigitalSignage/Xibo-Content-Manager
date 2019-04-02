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
    eventController.createEvent(eventId,initLayoutId,displaysId,startDate,endDate,priority, ()=>{
        started = 1
        res.end('<h1>Competicion Iniciada. Escuchando cambios en el servidor</h1>')
        pollFeature.pollingRemoteFile(req.body.urlName, (fileChanged)=>{
           const content = JSON.parse(fileChanged)
           for (const key in content){
               if (content.hasOwnProperty(key)){
                    //Provisional: Solo un layout con valor a 1 en el json
                    if (content[key] === 1){
                        eventController.editEvent(initLayoutId,eventId,displaysId,startDate,endDate,priority, key, ()=>{
                            console.log('Evento cambiado con exito(IdLayout = ' + key + ')')
                        })
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