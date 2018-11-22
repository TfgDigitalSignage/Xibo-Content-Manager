var localServices = {
  //endpoint : '',
  dataType : 'json',
  method: 'GET',

  _getJSON: function (url, callback){
    $.ajax({
      url: url,
      method: localServices.method,
      dataType : localServices.dataType
    })
    .done(function (data){
      console.log('Data retieve sucessfully');
      callback & callback (data);
    })
    .fail(function(data){
      console.log('Error retrieving JSON data: ' + data);
    });
  }
}

var xiboServices = {
  //Client implemntation for Xibo Cms Services
  //url_base: 'http://localhost/xibo/api/',
  url_base: 'http://localhost/api/',
  accessToken: '',
  //client_id_gabri: 'G9QF9y7gbSfnmhfoFsfc2zZD2nBJeeKIHUXpLYEj',
  //client_secret_gabri: 'vWTTgO33E1Hpgw0gM8DUkqF7lTlLGPJNBkznS9O2tUatjPewEQwYpePGJW8gvVgGpniF4fAmMCJRuUKfePKdy9uF2Pe2iJmksNm6dHosoaj9vCzVYG5omkucvWOAqchchcX1kSeLaZA8IkBAb6xdS4Qol3flE73guxgoqXiiiq3WlDuAuUwgAW3iKt6bWDaWnRpFgr4oM1VjIfxd85yHH9v5POHubJwrYLul3Sex040UlEjrcfCpoc59or85DD',
  // client_id_adri: 'CE2KNI8jSH1AZD7JumvUJhZwC52Zh9Oqq7nScP94',
  // client_secret_adri: 'F55zivjCEvTuz0Iuempkd43OMlojHq51B8PhvuyS6rm1wmPwSajQfFbHAgyLVvgh5AnZ479ywQmyRPPbWj02P1HaCBHExPFR9vKGHe1k6QIpZClJgJFwbbmJ7gIwFDhWQBE0arYqFjkfDdeKzMah9O1I9gXZZklXdVvHYgXYnqDmflVgb0GuxBolfFMTIiHdjqHBsTt9ctbmryG33PJIhEfGL8hmuO0gVlWe0meRHNrzPpqe0k7CU01g4eRXbG',
  client_id: 'Aw8RNRb5AEqmS7B8C5ipq5XcV40LxagxnD41sCmg',
  client_secret: '6gWsZef5ajJiTKmuPiQB56vCrlVQi86o0DqxTiKZyzu1XpzX4jzSug5BPRmnTFbjLDgcVVXTFsO0594mp1e07qAgvMxAjiEt1Yo83bYy4G6YgUD0EPKDJPGzIdhqUhc8iD7WyExfj9oDLauG2R4n0um5cMUEPVNI3ZvOOkJPoTXsV8K6xmA25Jscif3ZOncUQ5ivCfordmIlg0C5IHTVIjWGn9EyXGNECLsIZLBGAKwka3Eq01MqRKpPnR9u7F',

  authorize: function (callback){
    $.ajax({
      url: xiboServices.url_base+'authorize/access_token',
      method: 'POST',
      data: {
        grant_type: 'client_credentials',
        client_id: xiboServices.client_id,
        client_secret: xiboServices.client_secret
      },
    }).done(function(value){
      console.log("Authorized");
      xiboServices.accessToken = value.access_token;
      callback & callback(value);
    });
  },

  _doRequest: function (endpoint, method, params, onSucces, onFail, onAlways){
    $.ajax({
      url: xiboServices.url_base + endpoint,
      method: method,
      data: params,
      crossDomain: true
    }).done(function(data){
      onSucces && onSucces(data);
    }).fail(function(data){
      console.log(data);
      onFail && onFail(data);
    }).always(function(data){
      onAlways && onAlways(data);
    });
  }
}
