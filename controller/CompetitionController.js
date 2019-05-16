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
    }
}