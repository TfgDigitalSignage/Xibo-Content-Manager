//NodeJs request module
var request = require ('request');
var qs = require('querystring');
var constant = {
    //CLIENT INFO GABRI
    client_id: 'Qen6esvNNsZrf3z8dU1BB0J8gakFr1IE8VDZV3hS',
    client_secret: 'WCVlzSecKzLXV6J8UJehZv7VjKRPj6mxmJJeIdWHnG1aKPsm4kSsgy1g8s5l3E4duXXq1Qlo0ERuAesRVrS7vzoKUMtABFnDWj48PQSCXaXCJ7eXlCTBiEeOUxXnbVSmjtodFjwZgNvbMNjUCAwPrOebAm9yaqVkCIjYY3mmHeuUyaBOFf10lzmR1gslmbTHzBau0YAKRenhXtMV4AUj3oG9RS1h5dkxR0tfxwHeJTDTDYfWCi7tkVaTgifiKY',
    baseUrl: 'http://localhost/api/'
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
      callback && callback(JSON.parse(body));
    }
  });
}

function getTime (token, callback){
    // var headers = {
    //   access_token: token
    // }
    request.get(constant.baseUrl + "clock?access_token="+token, function(error, response, body){
      if (!error) callback && callback(body);
    });
}

function getJsonData (url, callback){
    request.get (url, function(err, res, body){
      if (err)
        throw new Error (err);
      callback && callback (body);
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
    callback && callback (response);
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
      useDuration: useDuration(),
      duration: duration()
    }
  };

  request.post(options, function(err, response, data){
    if (err)
      throw new Error(err);
    callback && callback (response, JSON.parse(data));
    });
}

function postOrderWidget (token, playlistId, widgedId, order, callback){
  //const widgetsFormData = qs.stringify(widget_pos/*,',\n',':'*/);
  const key = "widgets["+widgedId+"]";
  
  var options = {
    url: constant.baseUrl + "playlist/order/" + playlistId,
    headers: {
      'content-type'  : 'application/x-www-form-urlencoded'
    },
    // form: {
    //   access_token: token,
    //   key: order
    // }
  };


  const req = request.post(options, function(err, response, data){
    if (err)
      throw new Error(err);

    callback && callback (response, data);
  });
  const form = req.form();
  form.append(key, order);
  form.append("access_token", token);
}

function getLibraryMedia(token, callback){
  var options = {
    url: constant.baseUrl + 'library' + '?access_token=' + token,
    headers: {
      'content-type'  : 'application/x-www-form-urlencoded'
    }
  }
  request.get(options, (error, response, body) => {
    if (!error){
      callback && callback (response, body);
    }
  });
}

exports.xibo_getAccessToken =  getAccessToken
exports.xibo_getTime = getTime
exports.getJsonData = getJsonData
exports.postLayout = postLayout
exports.postWidgetWebContent = postWidgetWebContent
exports.postOrderWidget = postOrderWidget
exports.getLibraryMedia = getLibraryMedia
