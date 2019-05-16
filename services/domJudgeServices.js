const request = require ('request')
const ndjson = require('ndjson')
const base64Encoder = require('../util/utils').getBase64Token
const qs = require('querystring');

const baseUrl = 'http://testdj.programa-me.com/domjudge61/api/v4/'
// const baseUrl = 'http://localhost:12345/api/v4/'
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
            if (err || res.statusCode>=400) console.log(err)
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
            if (err || res.statusCode>=400) console.log(err)
            callback(body)
        })
    },

    getProblem: (contestId,problem_id,callback) =>{
        
        const options = {
            url: baseUrl + 'contests/' + contestId + '/problems/' + problem_id,
            headers: { 
                'Authorization': 'Basic ' + base64Encoder('xibo', 'xiboadmin'),
                'Content-Type': 'application/json' } 
        }
        request.get(options, (err, res, body)=>{
            if (err || res.statusCode>=400) console.log(err)
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
    },
    getJudgementForSubmission: (contestId, submissionId, callback) => {
        const options = {
            url: baseUrl + 'contests/' + contestId + '/judgements',
              qs: {
                submission_id: submissionId
              },
            headers: { 
                'Authorization': 'Basic ' + base64Encoder('xibo', 'xiboadmin'),
                'Content-Type': 'application/json' } 
        }
        request.get(options, (err, res, body)=>{
            if (err) throw err
            callback(body)
        })
    },
    getTeam: (contestId, teamId, callback) => {
        const options = {
            url: baseUrl + 'contests/' + contestId + '/teams/' + teamId,
            headers: { 
                'Authorization': 'Basic ' + base64Encoder('xibo', 'xiboadmin'),
                'Content-Type': 'application/json' } 
        }
        request.get(options, (err, res, body)=>{
            if (err) throw err
            callback(body)
        })
    }


    //getNameProblem: (contestId,problem_id,callback) =>{


/*
    getContestClarifications: (contestId, callback) => {
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



