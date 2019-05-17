const express = require('express')
const request = require('request')
const router = express.Router()

const competitionController = require('../controller/CompetitionController')
const eventController = require ('../controller/EventController')
const videoController = require('../controller/VideoController')
const layoutController = require('../controller/layoutController')
const dateUtil = require('../util/date')

let started = 0

//Xibo config
const eventId = 38
const initLayoutId = 16
const scoreboardLayoutId = 10
const webcamLayoutId = 15
const displaysId = 5
const priority = 1
//DomJudge config
const competitionId = 5
//HLS Server config
const videoServer = "http://192.168.1.17:3030/"
// const videoServer = "http://localhost:3030/"
const videoServer_username = "admin"
const videoServer_password = "1985"

router.get('/', (req,res,next)=>{
    res.render('competition')
})

//Twitter, Imagen Clasificacion, WebPage, WebCamStreaming -> Mismo layout
router.post('/start', (req,res,next)=>{
    if (started === 1){
        return res.end('<h1>Lo sentimos, ya hay un concurso en marcha para hoy</h1>')
    }
    let eventId = ''
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
                videoController.startStopVideoServer(videoServer, 'start-server', videoServer_username, videoServer_password, body=>{
                    if (JSON.parse(body).status !== "success"){
                        console.log("Cannot start webcam server pointed at ", videoServer)
                    }
                    else{
                        videoController.insertHlsWidget(videoServer+"live/playlist.m3u8", webcamLayoutId, data=>{
                            const opt = {
                                layoutId: webcamLayoutId,
                                uri: 'http://localhost:3000/competition/judgement-type/' + event.data.id
                            }
                            layoutController.editSubmissionFeed(opt, body=>{
                                eventController.editEvent(webcamLayoutId, eventId, displaysId, startDate, endDate, priority, ()=>{
                                    console.log("Everything ok")
                                    setInterval(()=>{
                                        videoController.startStopVideoServer(videoServer, 'stop-server', videoServer_username, videoServer_password, body=>{
                                            eventController.editEvent(scoreboardLayoutId, eventId, displaysId, startDate, endDate, priority, ()=>{
                                                setInterval(()=>{
                                                    eventController.editEvent(initLayoutId, eventId, displaysId, startDate, endDate, priority, ()=>{})
                                                }, 1000)
                                            })
                                        })
                                    }, 10000)
                                })
                            })
                        })
                    }
                })
                
                // let dataSubmission = event.data
                // submissionPendingId[dataSubmission.id] = 1
                // console.log(dataSubmission)
                // let teamId = dataSubmission.team_id
                // var myDate = new Date(dataSubmission.time);
                // var minutes = myDate.getMinutes();
                // var hours = myDate.getHours();
                // let time = hours + ":" + minutes
                // let problemId = dataSubmission.problem_id
                // submissionCounter = submissionCounter + 1
                // competitionController.getContest(competitionId, contest=>{
                //     competitionController.getTeam(competitionId, teamId, team=>{
                //         let teamName = JSON.parse(team).name
                //         competitionController.getProblem(competitionId, problemId, problem =>{
                //             let problemName = JSON.parse(problem).name
                //             console.log("CONTEST: " + contest)
                //             console.log("TEAM: " + team)
                //             console.log("PROBLEM: " + problem)
                //             res.status(200).render('submissionsTable', {
                //                 submissionId: dataSubmission.id,
                //                 time: time,
                //                 teamId: teamId, 
                //                 teamName: teamName,
                //                 problemId: problemId, 
                //                 problemName: problemName,
                //                 "judgement": "waiting",
                //                 submissionCounter: submissionCounter
                //             })
                //         })
                //     })
                // }) 
                
            break;
            case 'judgements':
                // if (event.data.judgement_type_id == "AC"){
                //     //Poner clasificacion actualizada  
                //     eventController.editEvent(scoreboardLayoutId, eventId, displaysId, startDate, endDate, priority, body=>{
                //         console.log('Schedule modified: ', body)
                //     })
                // }
                // if (submissionPendingId[event.data.submission_id] && event.data.judgement_type_id != null){
                //     console.log("RESUELTO")
                //     console.log(event.data)
                //     submissionPendingId[event.data.submission_id] = 0
                // }
                    
            break;
            default:
            break;
        }
    })
})

router.get('/submissionFeed/:submissionId', (req,res,next)=>{
    competitionController.submissionFeed(competitionId, req.params.submissionId, res)
})

router.get('/judgement-type/:submissionId', (req,res,next)=>{
    competitionController.getJudgementForSubmission(competitionId, req.params.submissionId, res)
})

router.get('/scoreboard', (req,res,next)=>{
    competitionController.getScoreboard(competitionId, res);
})

router.get('/submission-graphic',(req,res,next)=>{
    competitionController.getGraphics(competitionId, res);
})


router.get('/remainingTime', (req,res,next)=>{
    competitionController.getRemainingTime(competitionId, res);
})


router.get('/teams',(req,res,next)=>{
    competitionController.getTeams(competitionId,res);
})

router.get('/contest',(req,res,next)=>{
    competitionController.getCompetition(competitionId,res);
})
module.exports = router