const express = require('express')
const router = express.Router()

const competitionController = require('../controller/CompetitionController')
const eventController = require ('../controller/EventController')
const videoController = require('../controller/VideoController')
const layoutController = require('../controller/layoutController')
const util = require('../util/date')

let options = {
    //Xibo specs
    eventId: '',
    mainLayoutId: '',
    mainPlaylistId: '',
    submissionLayout: '',
    hlsWidget: "",
    submissionWidget: "",
    start_time: util.todayISOFormat(),
    end_time: util.addDaysTodayISOFormat(1),
    displaysId: process.env.XIBO_DISPLAY_ID,
    priority: parseInt(process.env.XIBO_COMPETITION_PRIORITY,10),
    //DomJudgeSpecs
    contestId: process.env.DOMJUDGE_CONTEST_ID,
    //VideoServer specs
    videoServer_username: process.env.HLS_SERVER_USERNAME,
    videoServer_password: process.env.HLS_SERVER_PASSWORD
}

router.get('/', competitionController.createContestForm)

let state = ""

router.post('/start', async (req,res,next)=>{
    const layoutName = req.body.layoutName
    if (!layoutName){
        res.render('competition/competitionError', {
            msg: "Por favor, introduce un nombre para las diapositivas del concurso."
        })
    }
    const templateId = isNaN(req.body.templateId) ? '': req.body.templateId
    const templateStreamId = isNaN(req.body.templateStreamId) ? '': req.body.templateStreamId
    const address = await require('../util/utils').getLocalAddress()
    const base_url = address + '/competition/'
    competitionController.prepareSubmissionLayout(options, layoutName, templateStreamId, () => {
        competitionController.beforeContestSchedule(options, base_url, layoutName, templateId, res);
    });
    state = "non_Started"
    competitionController.getContest(options.contestId, info=> {
        let startTime = JSON.parse(info).start_time
        let remainingStart = new Date(startTime).getTime() - new Date().getTime()
        let endTime = JSON.parse(info).end_time
        let remainingEndTime = new Date(endTime).getTime() - new Date().getTime()
        let startInterval = {}
        let updateStatusInterval = {}

        startInterval = setInterval(()=>{
            clearInterval(startInterval)
            competitionController.contestSchedule(options, base_url, layoutName, templateId);
            state = "started"
        }, remainingStart)

        stopInterval = setInterval(()=>{
            clearInterval(stopInterval)
            clearInterval(updateStatusInterval)
            competitionController.afterContestSchedule(options, base_url, layoutName, templateId);
            state = "ended"
        }, remainingEndTime)

        updateStatusInterval = setInterval(async ()=>{
            const status = await competitionController.checkContestStatusChange(options.contestId, startTime, endTime)
            if (status.startChanged){
                clearInterval(startInterval)
                remainingStart = new Date(status.newStart).getTime() - new Date().getTime()
                startInterval = setInterval(()=>{
                    clearInterval(startInterval)
                    competitionController.contestSchedule(options, base_url, layoutName, templateId);
                    state = "started"
                }, remainingStart)
            }
            if (status.endChanged){
                clearInterval(stopInterval)
                remainingEndTime = new Date(status.newEnd).getTime() - new Date().getTime()
                stopInterval = setInterval(()=>{
                    clearInterval(stopInterval)
                    competitionController.afterContestSchedule(options, base_url, layoutName, templateId);
                    state = "ended"
                }, remainingEndTime)
            }
        }, 120000) //2 min
    })
    competitionController.contestFeedListerner(options.contestId, event => {
       if (state == "started"){
        let created = ""
            switch(event.type){
                case 'submissions':
                    competitionController.getTeam(options.contestId, event.data.team_id, data => {
                        const team = JSON.parse(data)
                        const members_field = team.members.split('\r\n')
                        const webcamIp = members_field[members_field.length-1].includes('http://') ? members_field[members_field.length-1]: 'http://' + members_field[members_field.length-1]
                        videoController.startStopVideoServer(webcamIp, '/start-server', body=>{
                            if (!body || JSON.parse(body).status !== "success"){
                                console.log("Cannot start webcam server pointed at ", webcamIp)
                            }
                            else{
                                videoController.editHlsWidget(options.hlsWidget, webcamIp+"/live/playlist.m3u8", data=>{
                                    const uri = address + '/competition/submissionFeed/' + event.data.id + "?user=" + process.env.ACCESS_USERNAME + "&pass=" + process.env.ACCESS_PASSWORD
                                    layoutController.editSubmissionFeed(options.submissionWidget, uri, body=>{
                                        eventController.editEvent(options.submissionLayoutCampaing, options.eventId, options.displaysId, options.start_time, options.end_time, options.priority, ()=>{
                                            let interval = setInterval(()=>{
                                                videoController.startStopVideoServer(webcamIp, '/stop-server', body=>{
                                                    eventController.editEvent(options.mainCampaignId, options.eventId, options.displaysId, options.start_time, options.end_time, options.priority, ()=>{
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
                    if (event.data.judgement_type_id === "AC"  && !created){
                        competitionController.getACJudgements(options.contestId, data => {
                            const judgementCorrects = JSON.parse(data)
                            if (judgementCorrects.length > 2){
                                //Add stadistic
                                created = "1"
                                const submissionGraphic_uri = base_url + 'submission-graphic?user=' + process.env.ACCESS_USERNAME + '&pass=' + process.env.ACCESS_PASSWORD
                                layoutController.createWebPageWidgetDummy(options.mainPlaylistId, submissionGraphic_uri, body => {
                                })
                            }
                        })
                    }
                break;
                default:
                break;
            }
        }
    })
})

router.post('/stop', (req,res,next)=> {
    state == "non_Started"
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