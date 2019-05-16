const domJudgeServices = require('../services/domJudgeServices')

module.exports = {
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
    getJudgementForSubmission:(contestId, submissionId, callback) => {
        domJudgeServices.getJudgementForSubmission(contestId, submissionId, judgement=>{
            callback(judgement)
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
                        response.status(200).render('scoreboard', {
                            'teams': teams
                        });
                    }
                })
            });
        })
    },


    getRemainingTime: (contestId, response) => {
        domJudgeServices.getContest(contestId, contest=>{
            contestname = JSON.parse(contest).name
            shortname = JSON.parse(contest).shortname
            endTime = JSON.parse(contest).end_time;
            milisecsEndTime = new Date(endTime).getTime()
            response.status(200).render('remainingTime', {
                endTime: milisecsEndTime,
                contestname: contestname,
                shortname: shortname
            });
         })
    },


    getGraphics: (contestId,response) => {
        domJudgeServices.getAllJudgements(contestId, judgments =>{
            const graphicObj = []
            let end = 0
            judgments = JSON.parse(judgments)
            judgments.forEach((element, index) => {
                domJudgeServices.getSubmission(contestId, element.submission_id, submission =>{
                    submission = JSON.parse(submission)
                    domJudgeServices.getProblem(contestId, submission.problem_id, problem =>{
                        problem = JSON.parse(problem)
                        const pos = graphicObj.findIndex(item=>item[0] === problem.short_name)
                        end++
                        if (pos != -1){
                            judgments[pos][1]++;
                            const curr = judgments[pos][2]
                            judgments[pos][2] = curr + 1 ? element.judgement_type_id === "AC": curr
                        }
                        else{
                            let corrects = 0
                            if (element.judgement_type_id === "AC")
                                corrects++
                            graphicObj.push([
                                problem.short_name, 
                                1,
                                corrects
                            ])
                        }
                        if (end == judgments.length){
                            response.status(200).render('submissions-graphic', {
                                "data": graphicObj,
                                "dataLength": graphicObj.length
                            })
                        }
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
                teams[i] = {
                    'name': callback[i].name,
                    'members': callback[i].members
                }
                i++
            }
            response.status(200).render('teams', {'teams': teams});
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
                    teams[i] = {
                        'name': callback[i].name,
                        'members': callback[i].members
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
                    response.status(200).render('contest', {'competition': competition, 'teams': teams, 'problems': problems});
                })
               
            })
        })
    }
}