const domJudgeServices = require('../services/domJudgeServices')

module.exports = {
    contestFeedListerner: (contestId, callback) => {
        domJudgeServices.getContestEventFeed(contestId, event=>{
            callback(event)
        })
    },

    updateScoreboard: (contestId, response) => {
        domJudgeServices.getScoreboard(contestId, board => {
            const teams = []
            const rows = JSON.parse(board).rows;
            for (const row in rows){
                domJudgeServices.getOneTeamFromContest(contestId, rows[row].team_id, team => {
                    team = JSON.parse(team) 
                    teams.push({
                        'rank': rows[row].rank, 
                        'name': team.name, 
                        'score': rows[row].score.num_solved, 
                        'total': rows[row].score.total_time
                    })
                    if (teams.length == rows.length){
                        response.render('scoreboard.pug', {
                            'teams': teams
                        });
                    }
                })
            }
        })
    }
}