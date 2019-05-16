const domJudgeServices = require('../services/domJudgeServices')

module.exports = {
    contestFeedListerner: (contestId, callback) => {
        domJudgeServices.getContestEventFeed(contestId, event=>{
            callback(event)
        })
    },

    getScoreboard: (contestId, response) => {
        let cont = 0;
        domJudgeServices.getScoreboard(contestId, board => {
            const teams = []
            const rows = JSON.parse(board).rows;
            rows.forEach((element,index) => {
                domJudgeServices.getOneTeamFromContest(contestId, element.team_id, team => {
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

        domJudgeServices.getAllJudgements(contestId, callback =>{
            const problem = []
            callback = JSON.parse(callback)
            callback.forEach((element,index) => {
                domJudgeServices.getSubmission(contestId,callback[index].submission_id, body =>{
                    //console.log(JSON.parse(body).problem_id)
                    body = JSON.parse(body)
                    domJudgeServices.getNameProblem(contestId,body.problem_id, res =>{
                        console.log(JSON.parse(res).name)
                    })
                })
            })
        })
    },

    getTeams: (constestId, response) => {
        let cont = 0;
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
             response.status(200).render('contest', {'competition': competition});
        })
    }
}