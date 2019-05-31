const express = require('express')
const router = express.Router()

const competitionController = require('../controller/CompetitionController')
const eventController = require ('../controller/EventController')
const videoController = require('../controller/VideoController')
const layoutController = require('../controller/layoutController')

let options = {
    //Xibo specs
    eventId: '',
    mainLayoutId: '',
    mainPlaylistId: '',
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
    res.render('competition/competition')
})

router.get('/test', (req, res, next)=>{
    layoutController.getContestTemplate(t => console.log(t));
})

router.post('/start', (req,res,next)=>{
    const base_url = require('../util/utils').getIpv4LocalAddress(req) + '/competition/'
    competitionController.initCompetitionSchedule(options, base_url, req.body.layoutName, res);
    competitionController.contestFeedListerner(options.contestId, event => {
        switch(event.type){
            case 'submissions':
                competitionController.getTeam(options.contestId, event.data.team_id, data => {
                    const team = JSON.parse(data)
                    const members_field = team.members.split('\r\n')
                    const webcamIp = members_field[members_field.length-1]
                    videoController.startStopVideoServer(webcamIp, '/start-server', body=>{
                        if (!body || JSON.parse(body).status !== "success"){
                            console.log("Cannot start webcam server pointed at ", webcamIp)
                        }
                        else{
                            videoController.insertHlsWidget(webcamIp+"/live/playlist.m3u8", options.submissionLayout, data=>{
                                const opt = {
                                    layoutId: options.submissionLayout,
                                    uri: require('../util/utils').getIpv4LocalAddress(req) + '/competition/submissionFeed/' + event.data.id
                                }
                                layoutController.editSubmissionFeed(opt, body=>{
                                    eventController.editEvent(options.submissionLayout, options.eventId, options.displaysId, options.start_time, options.end_time, options.priority, ()=>{
                                        let interval = setInterval(()=>{
                                            videoController.startStopVideoServer(webcamIp, '/stop-server', body=>{
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
                })
                
            break;
            case 'judgements':
                if (event.data.judgement_type_id === "AC"){
                    competitionController.getACJudgements(options.contestId, data => {
                        const judgementCorrects = JSON.parse(data)
                        if (judgementCorrects.length > 10){
                            //Add stadistic
                            setInterval(()=>{
                                const submissionGraphic_uri = base_url + 'submission-graphic'
                                layoutController.createWebPageWidgetDummy(options.mainPlaylistId, submissionGraphic_uri, body => {
                                    const widgetId = JSON.parse(body).widgetId
                                    const del = setInterval(()=> {
                                        layoutController.deleteWidget({widgetId:widgetId}, ()=> {
                                            clearInterval(del)
                                        })
                                    }, 2000)
                                })
                            }, 15000)
                        }
                    })
                }
            break;
            default:
            break;
        }
    })
})

router.post('/stop', (req,res,next)=> {
    competitionController.stopCompetition(options, req, res)
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


router.get('/remainingEndTime', (req,res,next)=>{
    competitionController.getRemainingTime(options.contestId, "end", res);
})
router.get('/remainingStartTime', (req,res,next)=>{
    competitionController.getRemainingTime(options.contestId, "start", res);
})

router.get('/teams',(req,res,next)=>{
    competitionController.getTeams(options.contestId,res);
})

router.get('/contest',(req,res,next)=>{
    competitionController.getCompetition(options.contestId,res);
})

router.get('/congratulations',(req,res,next)=>{
    competitionController.congratulationsScreen(options.contestId,res);
})

router.get('/addTwitterRegion/:layoutId', (req,res,next)=>{
    layoutController.addTwitterRegionToLayout(req.params.layoutId, (regionInfo)=>{
        let widgetParams = {
            widgetName : "TwitterWidget",
            widgetId: "",
            widgetType: "twitter"
        }
        let layoutParams = {
            layoutName : "",
            layoutId : req.params.layoutId,
            layoutBackgroundColor : "",
            layoutBackgroundzIndex : "",
            layoutRegion: regionInfo.regionId,
            layoutPlaylist:regionInfo.playlists[0]
        }
        let requiredParams =[];
        requiredParams.push({
            key: "searchTerm",
            value: "from:FdiXibo"
        });
        requiredParams.push({
            key: "searchTerm",
            value: 12
        });
        layoutController.addWidget(widgetParams, layoutParams, requiredParams, (callback)=>{
            console.log(callback)
        }) 
    })

})

module.exports = router