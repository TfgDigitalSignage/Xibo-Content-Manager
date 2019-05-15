const request = require ('request')
const ndjson = require('ndjson')
const base64Encoder = require('../util/utils').getBase64Token

const baseUrl = 'http://testdj.programa-me.com/domjudge61/api/v4/'
const username = "xibo"
const password = "xiboadmin"

module.exports = {
    getContestEventFeed: (contestId, callback) => {
        const options = {
            url: baseUrl + 'contests/' + contestId + '/event-feed?types=submissions,judgements',
            headers: { 
                'Authorization': 'Basic ' + base64Encoder(username, password),
                'Content-Type': 'application/x-ndjson' } 
        }
        request.get(options)
            .pipe(ndjson.parse())
            .on('data', obj => {
                if (Date.now() - Date.parse(obj.time) < 30000) //Request on the last 30secs (omiting old requests)
                    callback(obj)
            })
            .on('error', err=>{
                throw err;
            })        
    },

    getScoreboard: (contestId, callback) => {
        const options = {
            url: baseUrl + 'contests/' + contestId + '/scoreboard',
            headers: { 
                'Authorization': 'Basic ' + base64Encoder(username, password),
                'Content-Type': 'application/json' } 
        }
        request.get(options, (err, res, body)=>{
            if (err || res.statusCode >= 400) throw err
            callback(body)
        })
    },

    getAllJudgements: (contestId,callback) =>{
           const options = {
            url: baseUrl + 'contests/' + contestId + '/judgements',
            headers: { 
                'Authorization': 'Basic ' + base64Encoder('xibo', 'xiboadmin'),
                'Content-Type': 'application/json' } 
        }
        request.get(options, (err, res, body)=>{
            if (err) throw err

            callback(body)
        })
    },

    getSubmission: (contestId,submission_id,callback) =>{

        const options = {
            url: baseUrl + 'contests/' + contestId + '/submissions/' + submission_id,
            headers: { 
                'Authorization': 'Basic ' + base64Encoder('xibo', 'xiboadmin'),
                'Content-Type': 'application/json' } 
        }
        request.get(options, (err, res, body)=>{
            if (err) throw err
            callback(body)
        })
    },

    getNameProblem: (contestId,problem_id,callback) =>{
        
        const options = {
            url: baseUrl + 'contests/' + contestId + '/problems/' + problem_id,
            headers: { 
                'Authorization': 'Basic ' + base64Encoder('xibo', 'xiboadmin'),
                'Content-Type': 'application/json' } 
        }
        request.get(options, (err, res, body)=>{
            if (err) throw err
            callback(body)
        })
    },

    getContestStatus: (contestId, callback) => {
        const options = {
            url: baseUrl + 'contests/' + contestId + '/state',
            headers: { 
                'Authorization': 'Basic ' + base64Encoder('xibo', 'xiboadmin'),
                'Content-Type': 'application/json' } 
        }
        request.get(options, (err, res, body)=>{
            if (err) throw err
            callback(body)
        })
    },
    getContest: (contestId, callback) => {
        const options = {
            url: baseUrl + 'contests/' + contestId,
            headers: { 
                'Authorization': 'Basic ' + base64Encoder('xibo', 'xiboadmin'),
                'Content-Type': 'application/json' } 
        }
        request.get(options, (err, res, body)=>{
            if (err) throw err
            callback(body)
        })
    }  

<<<<<<< HEAD
    getNameProblem: (contestId,problem_id,callback) =>{

=======
/*
    getContestClarifications: (contestId, callback) => {
>>>>>>> 90a2822531095a77409c665840ba5b4b3ac1adca
        const options = {
            url: baseUrl + 'contests/' + contestId + '/clarifications',
            headers: { 
                'Authorization': 'Basic ' + base64Encoder('xibo', 'xiboadmin'),
                'Content-Type': 'application/json' } 
        }
        request.get(options, (err, res, body)=>{
            if (err) throw err
            callback(body)
        })
    },

    getAllTeams: (contestId, callback) =>{
        const options = {
            url: baseUrl + 'contests/' + contestId + '/teams',
            headers: { 
                'Authorization': 'Basic ' + base64Encoder('xibo', 'xiboadmin'),
                'Content-Type': 'application/json' } 
        }
        request.get(options, (err, res, body)=>{
            if (err) throw err
            callback(body)
        })  
    }
*/
}



