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
            endTime = JSON.parse(contest).end_time;
            milisecsEndTime = new Date(endTime).getTime()
            response.status(200).render('remainingTime', {
                endTime: milisecsEndTime
            });
        })
    }
}