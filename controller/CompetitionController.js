const domJudgeServices = require('../services/domJudgeServices')
const layoutController = require('../controller/layoutController')
const eventController = require('../controller/EventController')
const xiboServices = require('../services/xiboServices')
const date = require('../util/date')

module.exports = {
    
    createContestForm: (req,res,next) => {
        xiboServices.getAccessToken(body => {
            const token = body['access_token'];
            xiboServices.getTemplates(token, templateList => {
                let ret = {
                    "templates": [],
                    "templatesLength" : 0
                }
                if (templateList){
                    const list = JSON.parse(templateList)
                    if (list.length > 0){
                        list.forEach(item => {
                            ret.templates.push(item)
                            ret.templatesLength++
                        })
                    }
                }
                res.render('competition/competition', ret)
            })
        })   
    },

    contestFeedListerner: (contestId, callback) => {
        domJudgeServices.getContestEventFeed(contestId, event=>{
            callback(event)
        })
    },

    getContest: (contestId, callback) => {
        domJudgeServices.getContest(contestId, contest=>{
            callback(contest)
         })
    },

    getTeam: (contestId, teamId, callback) => {
        domJudgeServices.getTeam(contestId, teamId, team=>{
            callback(team)
         })
    },
    getProblem:(contestId, problemId, callback) => {
        domJudgeServices.getProblem(contestId, problemId, problem=>{
            callback(problem)
         })
    },
    getACJudgements: (contestId, callback) =>  domJudgeServices.getAllJudgements(contestId, 'correct', callback),

    getJudgementForSubmission:(contestId, submissionId, res) => {
        domJudgeServices.getJudgement(contestId, "", judgements=>{
            const filter = JSON.parse(judgements).find(judgment => judgment.submission_id === submissionId)
            let ret = {
                "status": "success",
                "data": "waiting"
            }
            if (filter.judgement_type_id)
                ret.data = filter.judgement_type_id
            return res.status(200).json(ret)
        })
    },

    getScoreboard: (contestId, response) => {
        let cont = 0;
        domJudgeServices.getScoreboard(contestId, board => {
            const teams = []
            const rows = JSON.parse(board).rows;
            rows.forEach((element,index) => {
                domJudgeServices.getTeam(contestId, element.team_id, team => {
                    teams[index] = {
                        'rank': element.rank, 
                        'name': JSON.parse(team).name, 
                        'score': element.score.num_solved, 
                        'total': element.score.total_time
                    }
                    cont++;
                    if (cont == rows.length){
                        response.status(200).render('competition/scoreboard', {
                            'teams': teams
                        });
                    }
                })
            });
        })
    },


    getRemainingTime: (contestId, startOrEnd, response) => {
        domJudgeServices.getContest(contestId, contest=>{
            const contestname = JSON.parse(contest).name
            const shortname = JSON.parse(contest).shortname
            let time = ''
            if(startOrEnd == 'start')
                time = JSON.parse(contest).start_time
            if(startOrEnd == 'end')
                time = JSON.parse(contest).end_time
            milisecsTime = new Date(time).getTime()
            response.status(200).render('competition/remainingTime', {
                time: milisecsTime,
                "startOrEnd": startOrEnd
            });
         })
    },

    getGraphics: (contestId,response) => {
        const graphicObj = []
        let end = 0
        domJudgeServices.getAllJudgements(contestId, 'correct', body =>{
            const judgementsAC = JSON.parse(body)
            domJudgeServices.getSubmission(contestId, '', body => {
                const submissions = JSON.parse(body)
                domJudgeServices.getProblem(contestId, '', body =>{
                    const problems = JSON.parse(body)
                    problems.forEach((problem, i) => {
                        const attemps = submissions.filter(item => item.problem_id === problem.id)
                        const corrects = judgementsAC.filter(judge => attemps.some(attemp => judge.submission_id == attemp.id))
                        graphicObj.push([
                            problem.short_name,
                            attemps.length,
                            corrects.length
                        ])
                    })
                    response.status(200).render('competition/submissions-graphic', {
                        "data": graphicObj,
                        "dataLength": graphicObj.length
                    })
                })
            })
        })
    },

    getTeams: (constestId, response) => {
        
        domJudgeServices.getAllTeams(constestId,callback =>{
            callback = JSON.parse(callback)
            var length = callback.length
            var i = 0
            var teams = []
            while (i < length){
                let tmp = ""
                if (callback[i].members){
                    const member_field = callback[i].members.split('\r\n')
                    for (let j = 0; j < member_field.length - 1; j++){
                        tmp += member_field[j];
                        if(j < member_field.length - 2)
                            tmp += ", "
                    }
                        
                            
                }
                teams[i] = {
                    'name': callback[i].name,
                    'members': tmp
                }
                i++
            }
            response.status(200).render('competition/teams', {'teams': teams});
        })
    },

    getCompetition: (constestId, response) => {
        let cont = 0;
        domJudgeServices.getContest(constestId,callback =>{
            callback = JSON.parse(callback)
            var aux = callback.start_time.split('T')
            var aux2 = aux[1].split('+')
            var ini = aux[0] + ' ' + aux2[0]
            var auxFin = callback.end_time.split('T')
            var aux3 = auxFin[1].split('+')
            var fin = auxFin[0] + ' ' + aux3[0]
            var competition = {
                'name': callback.formal_name,
                'ini': ini,
                'fin': fin,
                'duration': callback.duration
            }
            domJudgeServices.getAllTeams(constestId,callback =>{
                callback = JSON.parse(callback)
                var teams = []
                var length = callback.length
                var i = 0

                while (i < length){
                    let members = ""
                    if(callback[i].members){
                        let members_field = callback[i].members.split('\r\n')                 
                        for (let j = 0; j < members_field.length - 1; j++){
                            members += members_field[j];
                            if(j < members_field.length - 2)
                                members += ", "
                        }
                    }
                    teams[i] = {
                        'name': callback[i].name,
                        'members': members
                    }
                    i++
                }

                domJudgeServices.getProblem(constestId, "", problem=>{
                    var problems = []
                    problem = JSON.parse(problem)
                    var length = problem.length
                    var i = 0
                    while (i < length){
                        problems[i] = {
                            'name': problem[i].name
                        }
                        i++
                    }
                    response.status(200).render('competition/contest', {'competition': competition, 'teams': teams, 'problems': problems});
                })
               
            })
        })
    },

    submissionFeed: (competitionId, submissionId, res) => {
        domJudgeServices.getSubmission(competitionId, submissionId, dataSubmission=>{
            dataSubmission = JSON.parse(dataSubmission)
            const teamId = dataSubmission.team_id
            const myDate = new Date(dataSubmission.time);
            let minutes = myDate.getMinutes()
            let hours = myDate.getHours()
            if (hours < 10)
                hours = "0" + hours
            if (minutes < 10)
                minutes = "0" + minutes 
            const time = hours + ":" + minutes
            let judgement = "Waiting"
            domJudgeServices.getJudgement(competitionId, "", judgements=>{
                const filter = JSON.parse(judgements).find(judgment => judgment.submission_id === submissionId)
                if (filter) judgement = filter.judgement_type_id
                domJudgeServices.getTeam(competitionId, teamId, team=>{
                    const teamName = JSON.parse(team).name
                    domJudgeServices.getProblem(competitionId, dataSubmission.problem_id, problem =>{
                        const problemName = JSON.parse(problem).name
                        res.status(200).render('competition/submissionsTable', {
                            'submissionId': submissionId,
                            'time': time,
                            'teamName': teamName,
                            'problemName': problemName,
                            'judgement': judgement
                        })
                    })
                })
            })
        })
    },
    prepareSubmissionLayout: (params, layoutName, templateId, callback) => {
        layoutController.createLayout({
            layoutName: layoutName + "_streaming",
            templateId: templateId
        }, layout=>{
            params.submissionLayout = layout.layoutId
            params.submissionLayoutCampaing = layout.campaignId
            const regions = layout.regions
            regions.forEach(item=>{
                if(item.name==="StreamingRegion"){
                    //params.hlsWidget = item.playlists[0].widgets[0].widgetId
                }
                if(item.name==="SubmissionRegion"){
                    //params.submissionWidget = item.playlists[0].widgets[0].widgetId
                }
            })
            callback()
        })
    },
    beforeContestSchedule: (params, base_url, layoutName, templateId, res) => {
        //layoutController.getContestTemplate(templateId => {
            layoutController.createLayout({
                layoutName: layoutName + "_before",
                templateId: templateId
            }, layout => {
                if (layout.error){
                    return res.render('competition/competitionError', {
                        msg: "Ya existe un layout de un concurso previo con ese nombre o la plantilla elegida no existe"
                    })
                }
                params.beforeLayoutId = layout.layoutId
                params.beforeCampaingId = layout.campaignId
                const playlistId = layout.regions[0].playlists[0].playlistId
                //params.mainPlaylistId = playlistId
                const authSufix = "?user=" + process.env.ACCESS_USERNAME + "&pass=" + process.env.ACCESS_PASSWORD
                const contest_uri = base_url + 'contest'
                layoutController.createWebPageWidgetDummy(playlistId, contest_uri + authSufix, body => {
                    const teamInfo_uri = base_url + 'teams'
                    layoutController.createWebPageWidgetDummy(playlistId, teamInfo_uri + authSufix, body => {
                        const remainig_uri = base_url + 'remainingStartTime'
                        layoutController.createWebPageWidgetDummy(playlistId, remainig_uri + authSufix, body => {
                             eventController.createEvent({
                                campaignId: layout.campaignId,
                                displayGroupIds: params.displaysId, 
                                fromDt: params.start_time, 
                                toDt: params.end_time, 
                                isPriority: params.priority, 
                                displayOrder: 1, 
                                eventTypeId: 1
                            }, body => {
                                params.eventId = JSON.parse(body).eventId
                                const err = JSON.parse(body).error
                                if (err){
                                    return res.render('competition/competitionError', {
                                        msg: err.message
                                    })
                                }
                                res.render('competition/stopCompetition')
                            })
                        })
                    })
                })
            })
        //})
    },

    contestSchedule: (params, base_url, layoutName, templateId) => {
        // layoutController.getContestTemplate(templateId => {
            layoutController.createLayout({
                layoutName: layoutName,
                templateId: templateId
            }, layout => {
                if (!layout.error){
                    params.mainLayoutId = layout.layoutId
                    params.mainCampaignId = layout.campaignId
                    const playlistId = layout.regions[0].playlists[0].playlistId
                    params.mainPlaylistId = playlistId
                    const authSufix = "?user=" + process.env.ACCESS_USERNAME + "&pass=" + process.env.ACCESS_PASSWORD
                    const remainingTime_uri = base_url + 'remainingEndTime'
                    layoutController.createWebPageWidgetDummy(playlistId, remainingTime_uri + authSufix, body => {
                        const scoreboard_uri = base_url + 'scoreboard'
                        layoutController.createWebPageWidgetDummy(playlistId, scoreboard_uri + authSufix, body => {
                            eventController.editEvent(layout.campaignId, params.eventId, params.displaysId, params.start_time, params.end_time, params.priority, body=>{
                                // res.render('competition/stopCompetition')
                            })
                        })
                    })
                }
            })

        // })
    },

    afterContestSchedule: (params, base_url, layoutName, templateId) => {
        // layoutController.getContestTemplate(templateId => {
            layoutController.createLayout({
                layoutName: layoutName + "_after",
                templateId: templateId
            }, layout => {
                if (!layout.error){
                    params.afterLayoutId = layout.layoutId
                    params.afterCampaingId = layout.campaignId
                    const playlistId = layout.regions[0].playlists[0].playlistId
                    // params.mainPlaylistId = playlistId
                    const authSufix = "?user=" + process.env.ACCESS_USERNAME + "&pass=" + process.env.ACCESS_PASSWORD
                    const winners_uri = base_url + 'congratulations'
                    layoutController.createWebPageWidgetDummy(playlistId, winners_uri + authSufix, body => {
                        const scoreboard_uri = base_url + 'scoreboard'
                        layoutController.createWebPageWidgetDummy(playlistId, scoreboard_uri + authSufix, body => {
                            eventController.editEvent(layout.campaignId, params.eventId, params.displaysId, params.start_time, params.end_time, params.priority, body=>{
                                // res.render('competition/stopCompetition')
                            })
                        })
                    })
                }
            })
        // })
    },

    stopCompetition: (params, request, response) => {
        if (request.body.clean){
            eventController.deleteEvent(params, body=> {
                if (params.beforeLayoutId && params.beforeLayoutId != ''){
                    layoutController.deleteLayout({layoutId:params.beforeLayoutId}, body=>{
                        params.beforeLayoutId = ''
                    })
                }
                if (params.afterLayoutId && params.afterLayoutId != ''){
                    layoutController.deleteLayout({layoutId:params.afterLayoutId}, body=>{
                        params.afterLayoutId = ''
                    })
                }
                if (params.mainLayoutId && params.mainLayoutId != ''){
                    layoutController.deleteLayout({layoutId:params.mainLayoutId}, body=>{
                        params.mainLayoutId = ''
                    })
                }
                if (params.submissionLayout && params.submissionLayout != ''){
                    layoutController.deleteLayout({layoutId:params.submissionLayout}, body=>{
                        params.submissionLayout = ''
                    })
                }
                const i = setInterval(()=>{
                    clearInterval(i)
                    return response.redirect('/')
                }, 4000);
            })
        }
        else
            response.redirect('/competition')
    },

    congratulationsScreen: (contestId, res) => {
        domJudgeServices.getScoreboard(contestId,callback =>{
            winnerInfo = JSON.parse(callback).rows[0]
            teamId = winnerInfo.team_id
            score = winnerInfo.score
            problems = winnerInfo.problems
            domJudgeServices.getTeam(contestId, teamId, team=>{
                team = JSON.parse(team)
                teamName = team.name
                teamMembers = team.members
                members_field = teamMembers.split('\r\n')
                members = ""
                for (let j = 0; j < members_field.length - 1; j++){
                    members += members_field[j];
                    if(j < members_field.length - 2)
                        members += ", "
                }
                teamNationality = team.teamNationality
                teamOrganization = team.organization_id
                res.status(200).render('competition/congratulations', {
                    'teamName': teamName,
                    'members': members,
                    'score': score,
                    'numProblems': problems.length
                })
            })

        })
    }
}