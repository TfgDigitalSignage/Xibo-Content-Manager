const express = require('express')
const router = express.Router()

const competitionController = require('../controller/CompetitionController')
const eventController = require ('../controller/EventController')
const videoController = require('../controller/VideoController')
const layoutController = require('../controller/layoutController')
const dateUtil = require('../util/date')

let options = {
    //Xibo specs
    eventId: '',
    mainLayoutId: '',
    submissionLayout: '',
    start_time: '',
    end_time: '',
    displaysId: process.env.XIBO_DISPLAY_ID,
    priority: process.env.XIBO_COMPETITION_PRIORITY,
    //DomJudgeSpecs
    contestId: process.env.DOMJUDGE_CONTEST_ID,
    //VideoServer specs
    videoServer_username: process.env.HLS_SERVER_USERNAME,
    videoServer_password: process.env.HLS_SERVER_PASSWORD
}

router.get('/', (req,res,next)=>{
    res.render('competition')
})

router.post('/start', (req,res,next)=>{
    competitionController.initCompetitionSchedule(options, req.connection.remoteAddress, req.connection.localPort, res);
    competitionController.contestFeedListerner(options.contest, event => {
        switch(event.type){
            case 'submissions':
                videoController.startStopVideoServer(videoServer, 'start-server', body=>{
                    if (JSON.parse(body).status !== "success"){
                        console.log("Cannot start webcam server pointed at ", videoServer)
                    }
                    else{
                        videoController.insertHlsWidget(videoServer+"live/playlist.m3u8", options.submissionLayout, data=>{
                            const opt = {
                                layoutId: options.submissionLayout,
                                uri: require('../util/utils').getIpv4LocalAddress(req) + '/competition/submissionFeed/' + event.data.id
                            }
                            layoutController.editSubmissionFeed(opt, body=>{
                                eventController.editEvent(options.submissionLayout, options.eventId, options.displaysId, options.start_time, options.end_time, options.priority, ()=>{
                                    let interval = setInterval(()=>{
                                        videoController.startStopVideoServer(videoServer, 'stop-server', body=>{
                                            eventController.editEvent(options.mainLayoutId, options.eventId, options.displaysId, options.start_time, options.end_time, options.priority, ()=>{
                                                clearInterval(interval)
                                            })
                                        })
                                    }, process.env.WEBCAM_VIEW_DURATION)
                                })
                            })
                        })
                    }
                })
                
            break;
            case 'judgements':
                
            break;
            default:
            break;
        }
    })
})

router.get('/submissionFeed/:submissionId', (req,res,next)=>{
    competitionController.submissionFeed(options.contestId, req.params.submissionId, res)
})

router.get('/judgement-type/:submissionId', (req,res,next)=>{
    competitionController.getJudgementForSubmission(options.contestId, req.params.submissionId, res)
})

router.get('/scoreboard', (req,res,next)=>{
    competitionController.getScoreboard(options.contestId, res);
})

router.get('/submission-graphic',(req,res,next)=>{
    competitionController.getGraphics(options.contestId, res);
})


router.get('/remainingTime', (req,res,next)=>{
    competitionController.getRemainingTime(options.contestId, res);
})


router.get('/teams',(req,res,next)=>{
    competitionController.getTeams(options.contestId,res);
})

router.get('/contest',(req,res,next)=>{
    competitionController.getCompetition(options.contestId,res);
})

module.exports = router