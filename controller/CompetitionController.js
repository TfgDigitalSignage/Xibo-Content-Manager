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

    getGraphics: (contestId,response) => {

        domJudgeServices.getAllJudgements(contestId, callback =>{
            const problem = []
            callback = JSON.parse(callback)
            callback.forEach((element,index) => {
                domJudgeServices.getSubmission(contestId,callback[index].submission_id, body =>{
                    //console.log(JSON.parse(body).problem_id)
                    body = JSON.parse(body)
                    domJudgeServices.getNameProblem(contestId,body.problem_id, res =>{
                        console.log(JSON.parse(res.name))
                    })
                })
            })
        })
    }
}