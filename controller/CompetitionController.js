const domJudgeServices = require('../services/domJudgeServices')

module.exports = {
    contestFeedListerner: (contestId, callback) => {
        domJudgeServices.getContestEventFeed(contestId, event=>{
            callback(event)
        })
    },

    updateScoreboard: (contestId, response) => {
        let cont = 0;
        domJudgeServices.getScoreboard(contestId, board => {
            const teams = []
            const rows = JSON.parse(board).rows;
            /* for (const row in rows){
                domJudgeServices.getOneTeamFromContest(contestId, rows[row].team_id, team => {
                    const rank = rows[row].rank
                    teams[rank] = {
                        'rank': rank, 
                        'name': JSON.parse(team).name, 
                        'score': rows[row].score.num_solved, 
                        'total': rows[row].score.total_time
                    }
                    if (cont == rows.length){
                        response.status(200).render('scoreboard', {
                            'teams': teams
                        });
                    }
                })
            } */
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
                        console.log(teams)
                        response.status(200).render('scoreboard', {
                            'teams': teams
                        });
                    }
                })
            });
        })
    }
}