//NodeJs request module
var request = require ('request');
var qs = require('querystring');
var constant = {
    //CLIENT INFO GABRI
    //client_id: '6Ca5RWWPXR6Jq1kpYV9BV7z0nP6G9WAx7yacSnhs',
    //client_secret: '5GJrGW6RGMHeTkowBSTdsypdnWJaXG1uVWf9NnCPru74UOSjvlTMAk6FH5wi1eMm5rpzZbIuhV39oMoM1SQYD7f64FSQzMX2fZaQv3hcc8bYpncfplQhTy7fHIVWojUWvbd0BXmEXiZsagmyxRCcCy3Xcv8DHD2q2N6aNK1H1HfrWwTnZGTMkTkJMupaRP6L0Z1vrmeMCJ4sTmIb8srZeDRNAgYAId2r9uE2fnwvWeUYWJNonUB0exs2iQhWYj',
    //baseUrl: 'http://localhost/api/'
    //CLIENT INFO ADRI
    client_id: 'Tv7PRCwXCi3n6po1WcuhXzIsVZv0gb0gXE6kl7if',
    client_secret: 'ndTS6bNNxQ4S9qnT8akJrEoeOBHCO4RLmAYcrNlTMCPIxjfCL5Oc9HeEUv6Oi8Bq0OXQ2LQKCBUh7DUvqOKLY3L1aLyi1ngwcgByFi5YQ0nYfiJeOspmsFbBruT0GitdIp4AsFyRoMdytjVgqXiUvxQ20VtJ7iHmdozO4Hj5pO1F0lMWX9WBocBCoIrBBFS51P7sqjxu2QIh8ywOeEG3MhqvqIyTYod45NCopwpYfwJxWSp5kGswvweHWWZKIr',
    baseUrl: 'http://localhost/api/'
    //CLIENT INFO DANI
    //client_id: 'Aw8RNRb5AEqmS7B8C5ipq5XcV40LxagxnD41sCmg',
    //client_secret: '6gWsZef5ajJiTKmuPiQB56vCrlVQi86o0DqxTiKZyzu1XpzX4jzSug5BPRmnTFbjLDgcVVXTFsO0594mp1e07qAgvMxAjiEt1Yo83bYy4G6YgUD0EPKDJPGzIdhqUhc8iD7WyExfj9oDLauG2R4n0um5cMUEPVNI3ZvOOkJPoTXsV8K6xmA25Jscif3ZOncUQ5ivCfordmIlg0C5IHTVIjWGn9EyXGNECLsIZLBGAKwka3Eq01MqRKpPnR9u7F',
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

function getLayout (token, idLayout, callback){
  const options = {
    url: constant.baseUrl + 'layout',
    qs: {
      layoutId: idLayout, 
      embed: 'regions,playlists' 
    },
    headers:{ 
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/x-www-form-urlencoded' 
      } 
  }
  request.get(options, function (error, response, body) {
    if (error) throw new Error(error);
    callback && callback(response)
  })
}

function postLayout (token, name, callback){
  const options = {
    url: constant.baseUrl + "layout",
    headers:{
    'content-type' : 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer ' + token
    },
    form: {
      name: name
     }
   };

  request.post(options, function(err, response, body){
    if (err)
      throw new Error(err);
    callback && callback (response);
  });
}

function deleteLayout(token, idLayout, callback){
  const options = {
    url: constant.baseUrl + "layout/" + idLayout,
    headers:{
    'content-type' : 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer ' + token
    },
    formData: {
      layoutId: idLayout
     }
   };

  request.del(options, function(err, response, body){
    if (err)
      throw new Error(err);
    callback && callback (response);
  });
}

function getWidgetsOfPlaylist(token, playlistId, callback){
  var options = {
    url: constant.baseUrl + "playlist/widget?playlistId=" + playlistId,
    headers:{
    'content-type' : 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer ' + token
    }
  };

  request.get(options, function(err, response, data){
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

function postHlsWidget(token, playlistId, uri, useDuration, duration, callback){
  var options = {
    url: constant.baseUrl + 'playlist/widget/hls/' + playlistId,
    headers: {
      Authorization: 'Bearer ' + token,
      'content-type': 'application/x-www-form-urlencoded' 
    },
    formData: { 
      uri: uri,
      useDuration: useDuration,
      duration: duration
    }
  };

  request.post(options, function (error, response, body) {
    if (error) throw new Error(error);
    callback(body)
  });
}

function editHlsWidget(token, widgetId, uri, useDuration, duration, callback){
  var options = {
    url: constant.baseUrl + 'playlist/widget/' + widgetId,
    headers: {
      Authorization: 'Bearer ' + token,
      'content-type': 'application/x-www-form-urlencoded' 
    },
    formData: { 
      uri: uri,
      useDuration: useDuration,
      duration: duration
    }
  };

  request.put(options, function (error, response, body) {
    if (error) throw new Error(error);
    callback(body)
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

function addTextWidget(token, widgetType, playlistId, textParam, callback){
    var options = {
      url: constant.baseUrl + 'playlist/widget/' + widgetType + '/' + playlistId,
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded' 
      },
      form: { 
        text: textParam
      }
    };

    request.post(options, function (error, response, body) {
      if (error) throw new Error(error);
      callback(body)
    });
  }

function addHlsWidget(token, widgetType, playlistId, uriParam, callback){
    var options = {
      url: constant.baseUrl + 'playlist/widget/' + widgetType + '/' + playlistId,
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded' 
      },
      form: { 
        uri: uriParam
      }
    };

    request.post(options, function (error, response, body) {
      if (error) throw new Error(error);
      callback(body)
    });
  }

function addLocalVideoWidget(token, widgetType, playlistId, uriParam, callback){
    var options = {
      url: constant.baseUrl + 'playlist/widget/' + widgetType + '/' + playlistId,
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded' 
      },
      form: { 
        uri: uriParam
      }
    };

    request.post(options, function (error, response, body) {
      if (error) throw new Error(error);
      callback(body)
    });
  }

function addWebpageWidget(token, widgetType, playlistId, uriParam, modeIdParam, callback){
    var options = {
      url: constant.baseUrl + 'playlist/widget/' + widgetType + '/' + playlistId,
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded' 
      },
      form: { 
        uri: uriParam,
        modeId: modeIdParam
      }
    };

    request.post(options, function (error, response, body) {
      if (error) throw new Error(error);
      callback(body)
    });
  }

function addTwitterWidget(token, widgetType, playlistId, searchTermParam, templateIdParam, callback){
    var options = {
      url: constant.baseUrl + 'playlist/widget/' + widgetType + '/' + playlistId,
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded' 
      },
      form: { 
        searchTerm: searchTermParam,
        templateId: templateIdParam
      }
    };

    request.post(options, function (error, response, body) {
      if (error) throw new Error(error);
      callback(body)
    });
  }

function addClockWidget(token, widgetType, playlistId, clockTypeIdParam, callback){
    var options = {
      url: constant.baseUrl + 'playlist/widget/' + widgetType + '/' + playlistId,
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded' 
      },
      form: {
        clockTypeId: clockTypeIdParam 
      }
    };

    request.post(options, function (error, response, body) {
      if (error) throw new Error(error);
      callback(body)
    });
  }

function addEmbeddedWidget(token, widgetType, playlistId, embedHtmlParam, callback){
    var options = {
      url: constant.baseUrl + 'playlist/widget/' + widgetType + '/' + playlistId,
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded' 
      },
      form: { 
        embedHtml: embedHtmlParam
      }
    };

    request.post(options, function (error, response, body) {
      if (error) throw new Error(error);
      callback(body)
    });
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

function postSchedule(token, layoutId, displayGroupIds, fromDt, toDt,priority, callback) {
  const options = {
    url: constant.baseUrl + 'schedule',
    headers: 
    {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/x-www-form-urlencoded' 
      },
    form:
    {
      eventTypeId: '1',
      campaignId: layoutId,
      displayOrder: '1',
      isPriority: priority,
      'displayGroupIds[]': displayGroupIds,
      fromDt: fromDt,
      toDt: toDt
    }
  }

request.post(options, (error, response, body) => {
  if (error) throw new Error(error);

  callback(body)
});

}


function putSchedule(token, idLayout,idEvent,displayGroupIds,fromDt, toDt,priority, callback){
  var options = {
    url: constant.baseUrl + "schedule/"+ idEvent,
    headers: {
      Authorization: 'Bearer ' + token,
      'content-type'  : 'application/x-www-form-urlencoded'
    },
    form: {
      eventTypeId: 1,
      campaignId: idLayout,
      displayOrder: 1,
      isPriority: priority,
      'displayGroupIds[]': displayGroupIds,
      fromDt: fromDt,
      toDt: toDt
    }
  };
  request.put(options, function(error,request, body){
    if (error){
      throw new Error(error)
    }
    callback && callback(body);
  });
}

function deleteSchedule (token, scheduleId, callback) {
  const options = {
    url: constant.baseUrl + 'schedule/' + scheduleId,
    headers: {
      Authorization: 'Bearer ' + token
    } 
  }

  request.delete(options, function (error, response, body) {
    if (error) throw new Error(error);
    callback(body)
  });
}



function createCampaign(token, name, callback){
  const options = {
    url: constant.baseUrl + 'campaign',
    headers: 
     { 
       Authorization: 'Bearer ' + token,
       'content-type': 'multipart/form-data' 
     },
    form: { 
      name: name 
    } 
  };
  request.post(options, function (error, response, body) {
    if (error) throw new Error(error);
    callback(body)
  });
}

function deleteCampaign(token, idCampaign, callback){
  const options = {
    url: constant.baseUrl + 'campaign/' + idCampaign,
    headers: 
     { 
       Authorization: 'Bearer ' + token,
       'content-type': 'multipart/form-data' 
     },
    form: { 
    } 
  };
  request.del(options, function (error, response, body) {
    if (error) throw new Error(error);
    callback(body)
  });
}
function getCampaign (token, idCampaign, callback){
  const options = {
    url: constant.baseUrl + 'campaign',
    qs: {
      campaignId: idCampaign, 
      embed: 'regions,playlists' 
    },
    headers:{ 
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/x-www-form-urlencoded' 
      } 
  }
  request.get(options, function (error, response, body) {
    if (error) throw new Error(error);
    callback && callback(body)
  })
}
function addLayoutToCampaign(token, campaignId, layoutId, displayOrder, callback){

  let idLayout = 'layoutId[0][layoutId]'
  let orderDisplay = 'layoutId[0][displayOrder]'
  let options = {
    url: constant.baseUrl + 'campaign/layout/assign/' + campaignId,
    headers: 
     { 
       Authorization: 'Bearer ' + token,
       'content-type': 'multipart/form-data' 
     },
    formData: {
      idLayout: layoutId,
      orderDisplay: displayOrder
    } 
  };
    request.post(options, function (error, response, body) {
      console.log(response)
      if (error) throw new Error(error);
      callback && callback(body)
  })
}
/*
function createCampaign(token,campaignId,layoutId,layoutOrder,i,callback){
  var string1 = 'layoutId[' + i + '][layoutId]';
  var string2 = 'layoutId[' + i + '][displayOrder]'
  console.log(string1 + ' ' + layoutId)
  var request = require("request");
  var options = { method: 'POST',
    url: 'http://localhost/api/campaign/layout/assign/' + campaignId,
    headers: 
     { 
       Authorization: 'Bearer ' + token,
       'content-type': 'application/x-www-form-urlencoded' },
    formData: 
     { string1: layoutId,
       string2: layoutOrder } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    callback(body)
  });
}*/

function deleteWidget(token, widgetId, callback){
  var options = { 
    url: 'http://localhost/api/playlist/widget/' + widgetId,
    headers: 
     {
       'content-type': 'application/x-www-form-urlencoded',
       Authorization: 'Bearer ' + token 
     } 
   };
  request.del(options, function (error, response, body) {
    if (error) throw new Error(error);
    callback(body)
  });
}

exports.xibo_getAccessToken =  getAccessToken
exports.xibo_getTime = getTime
exports.getJsonData = getJsonData
exports.getLayout = getLayout
exports.postLayout = postLayout
exports.deleteLayout = deleteLayout
exports.getWidgetsOfPlaylist = getWidgetsOfPlaylist
exports.postHlsWidget = postHlsWidget
exports.editHlsWidget = editHlsWidget
exports.postWidgetWebContent = postWidgetWebContent
exports.postOrderWidget = postOrderWidget
exports.addTextWidget = addTextWidget
exports.addHlsWidget = addHlsWidget //Duplicada: LayoutManager y HLS Streaming Server
exports.addLocalVideoWidget = addLocalVideoWidget
exports.addWebpageWidget = addWebpageWidget
exports.addTwitterWidget = addTwitterWidget
exports.addClockWidget = addClockWidget
exports.addEmbeddedWidget = addEmbeddedWidget
exports.getLibraryMedia = getLibraryMedia
exports.postSchedule = postSchedule
exports.putSchedule = putSchedule
exports.deleteSchedule = deleteSchedule
//exports.createNameCampaign = createNameCampaign
exports.createCampaign = createCampaign
exports.deleteCampaign = deleteCampaign
exports.getCampaign = getCampaign
exports.addLayoutToCampaign = addLayoutToCampaign
exports.deleteWidget = deleteWidget