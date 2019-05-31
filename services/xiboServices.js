//NodeJs request module
const request = require ('request');

const xibo_client_id = process.env.XIBO_CLIENT_ID
const xibo_client_secret = process.env.XIBO_CLIENT_SECRET
const xibo_api_url = process.env.XIBO_API_URL

module.exports = {
  getAccessToken: callback=>{
    var options = {
      method: 'POST',
      url: xibo_api_url + "authorize/access_token",
      headers:{},
      form: {
        grant_type: 'client_credentials',
        client_id:     xibo_client_id,
        client_secret: xibo_client_secret
       }
     };
  
    request(options, function (error, response, body) {
      if (error){
        console.log("AUTH ERROR: " + error);
        //throw new Error(error);
      }
      else{
        callback && callback(JSON.parse(body));
      }
    });
  },

  getTime: (token, callback)=>{
    request.get(xibo_api_url + "clock?access_token="+token, function(error, response, body){
      if (!error) callback && callback(body);
    });
  },

  getLayout: (token, idLayout, callback)=>{
    const options = {
      url: xibo_api_url + 'layout',
      qs: {
        layoutId: idLayout, 
        embed: 'regions,playlists',
        length: 50 
      },
      headers:{ 
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded' 
        } 
    }
    request.get(options, function (error, response, body) {
      if (error) console.log(error) //throw new Error(error);
      callback && callback(response)
    })
  },

  postLayout: (token, name, templateId, callback)=>{
    const options = {
      url: xibo_api_url + "layout",
      headers:{
      'content-type' : 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
      },
      form: {
        name: name,
        layoutId: templateId
       }
     };
  
    request.post(options, function(err, response, body){
      if (err)
        console.log(err) //throw new Error(err);
      callback && callback (response);
    });
  },

  deleteLayout: (token, idLayout, callback)=>{
    const options = {
      url: xibo_api_url + "layout/" + idLayout,
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
        console.log(err) //throw new Error(err);
      callback && callback (body);
    });
  },

  getWidgetsOfPlaylist: (token, playlistId, callback)=>{
    var options = {
      url: xibo_api_url + "playlist/widget?playlistId=" + playlistId,
      headers:{
      'content-type' : 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
      }
    };
  
    request.get(options, function(err, response, data){
      if (err)
        console.log(err) //throw new Error(err);
      callback && callback (response);
      });
  },

  postWidgetWebContent: (playlistId, token, uri, modeId, useDuration, duration, callback)=>{
    var options = {
      url: xibo_api_url + "playlist/widget/webpage/" + playlistId,
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
        console.log(err) //throw new Error(err);
      callback && callback (response, JSON.parse(data));
      });
  },

  putWidgetWebContent: (widgedId, token, uri, modeId, useDuration, duration, callback)=>{
    var options = {
      url: xibo_api_url + "playlist/widget/" + widgedId,
      headers: {
        'content-type' : 'application/x-www-form-urlencoded',
        'authorization': 'Bearer ' + token
      },
      formData: {
        access_token: token,
        uri: uri,
        modeId: modeId,
        useDuration: useDuration,
        duration: duration
      }
    };
  
    request.put(options, function(err, response, data){
      if (err)
        console.log(err) //throw new Error(err);
      callback && callback (response, JSON.parse(data));
      });
  },

  postHlsWidget: (token, playlistId, uri, useDuration, duration, callback)=>{
    var options = {
      url: xibo_api_url + 'playlist/widget/hls/' + playlistId,
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
      if (error) console.log(error) //throw new Error(error);
      callback(body)
    });
  },

  editHlsWidget: (token, widgetId, uri, useDuration, duration, callback)=>{
    var options = {
      url: xibo_api_url + 'playlist/widget/' + widgetId,
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
      if (error) console.log(error) //throw new Error(error);
      callback(body)
    });
  },

  postOrderWidget: (token, playlistId, widgedId, order, callback)=>{
    //const widgetsFormData = qs.stringify(widget_pos/*,',\n',':'*/);
    const key = "widgets["+widgedId+"]";
    
    var options = {
      url: xibo_api_url + "playlist/order/" + playlistId,
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
       console.log(err) //throw new Error(err);

      callback && callback (response, data);
    });
    const form = req.form();
    form.append(key, order);
    form.append("access_token", token);
  },

  addTextWidget: (token, widgetType, playlistId, textParam, callback)=>{
    var options = {
      url: xibo_api_url + 'playlist/widget/' + widgetType + '/' + playlistId,
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded' 
      },
      form: { 
        text: textParam
      }
    };

    request.post(options, function (error, response, body) {
      if (error) console.log(error) //throw new Error(error);
      callback(body)
    });
  },

  addLocalVideoWidget: (token, widgetType, playlistId, uriParam, callback)=>{
    var options = {
      url: xibo_api_url + 'playlist/widget/' + widgetType + '/' + playlistId,
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded' 
      },
      form: { 
        uri: uriParam
      }
    };
    
    request.post(options, function (error, response, body) {
      if (error) console.log(error) //throw new Error(error);
      callback(body)
    });
  },

  addWebpageWidget: (token, widgetType, playlistId, uriParam, modeIdParam, callback)=>{
    var options = {
      url: xibo_api_url + 'playlist/widget/' + widgetType + '/' + playlistId,
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
        if (error) console.log(error) //throw new Error(error);
        callback(body)
      });
  },

  addTwitterWidget: (token, widgetType, playlistId, searchTermParam, templateIdParam, callback)=>{
    console.log("ADDING")
    var options = {
      url: xibo_api_url + 'playlist/widget/' + widgetType + '/' + playlistId,
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
      if (error) console.log(error) //throw new Error(error);
      callback(body)
    });
  },

  addClockWidget: (token, widgetType, playlistId, clockTypeIdParam, callback)=>{
    var options = {
      url: xibo_api_url + 'playlist/widget/' + widgetType + '/' + playlistId,
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded' 
      },
      form: {
        clockTypeId: clockTypeIdParam 
      }
    };

    request.post(options, function (error, response, body) {
      if (error) console.log(error) //throw new Error(error);
      callback(body)
    });
  },

  addEmbeddedWidget: (token, widgetType, playlistId, embedHtmlParam, callback)=>{
    var options = {
      url: xibo_api_url + 'playlist/widget/' + widgetType + '/' + playlistId,
      headers: {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded' 
      },
      form: { 
        embedHtml: embedHtmlParam
      }
    };
    
    request.post(options, function (error, response, body) {
      if (error) console.log(error) //throw new Error(error);
      callback(body)
    });
  },

  getLibraryMedia: (token,callback)=>{
    var options = {
      url: xibo_api_url + 'library' + '?access_token=' + token,
      headers: {
        'content-type'  : 'application/x-www-form-urlencoded'
      }
    }
    request.get(options, (error, response, body) => {
      if (!error){
        callback && callback (response, body);
      }
    });
  },

  getSchedule: (token, displayGroupId, date, callback)=>{
    const options = {
      url: xibo_api_url + 'schedule/' + displayGroupId + '/events',
      qs: {
        date: date
      },
      headers:{ 
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded' 
      } 
    }
    request.get(options, function (error, response, body) {
      if (error) console.log(error) //throw new Error(error);
      callback && callback(body)
    })
  },

  postSchedule: (token, layoutId, displayGroupIds, fromDt, toDt, priority, displayOrder, eventTypeId, callback)=>{
    const options = {
      url: xibo_api_url + 'schedule',
      headers: 
      {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      form:
      {
        eventTypeId: eventTypeId,
        campaignId: layoutId,
        displayOrder: displayOrder,
        isPriority: priority,
        'displayGroupIds[]': displayGroupIds,
        fromDt: fromDt,
        toDt: toDt
      }
    }
    
    request.post(options, (error, response, body) => {
      if (error) console.log(error) //throw new Error(error);
      
      callback(body)
    });
  },

  putSchedule: (token, idLayout,idEvent,displayGroupIds,fromDt, toDt,priority, callback)=>{
    var options = {
      url: xibo_api_url + "schedule/"+ idEvent,
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
        console.log(error) //throw new Error(error)
      }
      callback && callback(body);
    });
  },

  deleteSchedule: (token, scheduleId, callback)=>{
    const options = {
      url: xibo_api_url + 'schedule/' + scheduleId,
      headers: {
        Authorization: 'Bearer ' + token
      } 
    }
    
    request.del(options, function (error, response, body) {
      if (error) console.log(error) //throw new Error(error);
      callback(body)
    });
  },

  createCampaign: (token, name, callback)=>{
    const options = {
      url: xibo_api_url + 'campaign',
      headers: 
      { 
        Authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded' 
      },
      formData: { 
        name: name 
      } 
    };
    request.post(options, function (error, response, body) {
      if (error) console.log(error) //throw new Error(error);
      callback(body)
    });
  },
  
  addLayoutToCampaign: (token, campaignId, layoutToAddId, layoutDisplayOrder, callback)=>{
    let idLayout = 'layoutId[0][layoutId]'
    let orderDisplay = 'layoutId[0][displayOrder]'
    const options = {
      url: xibo_api_url + 'campaign/layout/assign/' + campaignId,
      headers: 
       { 
         Authorization: 'Bearer ' + token,
         'content-type': 'application/x-www-form-urlencoded' 
       },
      formData: {
        idLayout: layoutToAddId,
        orderDisplay: layoutDisplayOrder
      } 
    };
      request.post(options, function (error, response, body) {
        console.log(body)
        if (error) console.log(error) //throw new Error(error);
        callback && callback(body)
    })
  },

  deleteCampaign: (token, idCampaign, callback)=>{
    const options = {
      url: xibo_api_url + 'campaign/' + idCampaign,
      headers: 
      { 
        Authorization: 'Bearer ' + token
      },
      form: { 
      } 
    };
    request.del(options, function (error, response, body) {
      if (error) console.log(error) //throw new Error(error);
      callback(body)
    });
  },

  getCampaign: (token, idCampaign, callback)=>{
    const options = {
      url: xibo_api_url + 'campaign',
      qs: {
        campaignId: idCampaign, 
        embed: 'regions,playlists',
        length: 50
      },
      headers:{ 
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded' 
      } 
    }
    request.get(options, function (error, response, body) {
      if (error) console.log(error) //throw new Error(error);
      callback && callback(body)
    })
  },

  deleteWidget: (token, widgetId, callback)=>{
      var options = { 
        url: xibo_api_url + 'playlist/widget/' + widgetId,
        headers: 
        {
          'content-type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + token 
      } 
    };
    request.del(options, function (error, response, body) {
      if (error) console.log(error) //throw err;
      callback(body)
    });
  },

  addRegion: (token, layoutId, top, left, width, height, callback)=>{
      var options = { 
        url: xibo_api_url + 'region/' + layoutId,
        headers: 
        {
          'content-type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + token 
      },
      form: { 
          width: width, 
          height: height,
          top: top,
          left: left
      }
    };
    request.post(options, function (error, response, body) {
      if (error) console.log(error) //throw error;
      callback(body)
    })
  },

  getTemplates: (token, callback)=>{
    const options = {
      url: xibo_api_url + 'template',
      headers:{ 
        Authorization: 'Bearer ' + token,
      } 
    }
    request.get(options, function (error, response, body) {
      if (error) console.log(error)
      callback && callback(body)
    })
  } 
}