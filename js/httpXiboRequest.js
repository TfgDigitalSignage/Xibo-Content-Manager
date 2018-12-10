//NodeJs request module
var request = require ('request');
var constant = {
    //CLIENT INFO GABRI
    client_id: 'JV9ca7Too1JHvMD6YJexc9YfCLJeYXp4VguTJVwK',
    client_secret: 'L0Uohh4GzBMBKzbIhjKeH0s7X9ZASMAXBR4M5YB7jB9ReoULGDXJNUHiGMKp8jo8zVWxIF9Y6MKb2KdAScQVxDXUGE4sTzIgnjGA9n1Xm3izOdtKpV8MzshWq0mDTZVaQQ5AZWFYo3EXYePpG8tTcwLUETA8NaQqPWSpdm5PYwcK9DKnLxMpxwzt4CcNDzjddb1vVSaeIfTsNeeYXMTS0Q7X86loGdL95k3dizEgtloXigV7vy2yxhfi7EIlsI',
    baseUrl: 'http://localhost:8080/api/'
    //CLIENT INFO ADRI
    // client_id: 'CE2KNI8jSH1AZD7JumvUJhZwC52Zh9Oqq7nScP94',
    // client_secret: 'F55zivjCEvTuz0Iuempkd43OMlojHq51B8PhvuyS6rm1wmPwSajQfFbHAgyLVvgh5AnZ479ywQmyRPPbWj02P1HaCBHExPFR9vKGHe1k6QIpZClJgJFwbbmJ7gIwFDhWQBE0arYqFjkfDdeKzMah9O1I9gXZZklXdVvHYgXYnqDmflVgb0GuxBolfFMTIiHdjqHBsTt9ctbmryG33PJIhEfGL8hmuO0gVlWe0meRHNrzPpqe0k7CU01g4eRXbG',
    //baseUrl: 'http://localhost/api/'
    //CLIENT INFO DANI
    // client_id: 'Aw8RNRb5AEqmS7B8C5ipq5XcV40LxagxnD41sCmg',
    // client_secret: '6gWsZef5ajJiTKmuPiQB56vCrlVQi86o0DqxTiKZyzu1XpzX4jzSug5BPRmnTFbjLDgcVVXTFsO0594mp1e07qAgvMxAjiEt1Yo83bYy4G6YgUD0EPKDJPGzIdhqUhc8iD7WyExfj9oDLauG2R4n0um5cMUEPVNI3ZvOOkJPoTXsV8K6xmA25Jscif3ZOncUQ5ivCfordmIlg0C5IHTVIjWGn9EyXGNECLsIZLBGAKwka3Eq01MqRKpPnR9u7F',
    //baseUrl: 'http://localhost/api/'
}

function getAccessToken (callback){
  var options = {
    method: 'POST',
    url: constant.baseUrl + "authorize/access_token",
    // path: '/authorize/access_token',
    headers:{},
    form: {
      grant_type: 'client_credentials',
      client_id:     constant.client_id,
      client_secret: constant.client_secret
     }
   };

  request(options, function (error, response, body) {
    if (error){
      console.log("AUTH ERROR: " + error);
      throw new Error(error);
    }
    else{
      callback & callback(JSON.parse(body));
    }
  });
}

function getTime (token, callback){
    // var headers = {
    //   access_token: token
    // }
    request.get(constant.baseUrl + "clock?access_token="+token, function(error, response, body){
      if (!error) callback & callback(body);
    });
}

function getJsonData (url, callback){
    request.get (url, function(err, res, body){
      if (err)
        throw new Errror (err);
      callback & callback (body);
    });
}

function postLayout (token, name, callback){
  var options = {
    url: constant.baseUrl + "layout",
    headers:{
    'content-type' : 'application/x-www-form-urlencoded'
    },
    formData: {
      access_token: token,
      name: name
     }
   };

  request.post(options, function(err, response, body){
    if (err)
      throw new Error(err);
    callback & callback (response);
  });
}

function postWidgetWebContent (playlistId, token, uri, modeId, useDuration, duration, callback){
  var options = {
    url: constant.baseUrl + "playlist/widget/webpage/" + playlistId,
    headers: {
      'content-type' : 'application/x-www-form-urlencoded'
    },
    formData: {
      access_token: token,
      uri: uri,
      modeId: modeId,
      useDuration: useDuration,
      duration: duration
    }
  };

  request.post(options, function(err, response, data){
    if (err)
      throw new Error(err);
    console.log(response);
    callback & callback (response);
  });
}

exports.xibo_getAccessToken =  getAccessToken
exports.xibo_getTime = getTime
exports.getJsonData = getJsonData
exports.postLayout = postLayout
exports.postWidgetWebContent = postWidgetWebContent
