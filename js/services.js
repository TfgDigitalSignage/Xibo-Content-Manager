var localServices = {
  endpoint : '',
  dataType : '',
  method: '',

  _init : function (url, dataType, method){
    localServices.endpoint = url;
    localServices.dataType = dataType;
    localServices.method = method;
  },

  _doRequest: function (callback){
    $.ajax({
      url: localServices.endpoint,
      method: localServices.method,
      dataType : localServices.dataType
    })
    .done(function (data){
      console.log('Data retieve sucessfully');
      callback & callback (data);
    });
  }

}

var xiboServices = {
  //Client implemntation for Xibo Cms Services
  //url_base_gabri: 'http://localhost/xibo/api/',
  url_base: 'http://localhost/api/',
  accessToken: '',
  //client_id_gabri: 'G9QF9y7gbSfnmhfoFsfc2zZD2nBJeeKIHUXpLYEj',
  //client_secret_gabri: 'vWTTgO33E1Hpgw0gM8DUkqF7lTlLGPJNBkznS9O2tUatjPewEQwYpePGJW8gvVgGpniF4fAmMCJRuUKfePKdy9uF2Pe2iJmksNm6dHosoaj9vCzVYG5omkucvWOAqchchcX1kSeLaZA8IkBAb6xdS4Qol3flE73guxgoqXiiiq3WlDuAuUwgAW3iKt6bWDaWnRpFgr4oM1VjIfxd85yHH9v5POHubJwrYLul3Sex040UlEjrcfCpoc59or85DD',
  client_id: 'CE2KNI8jSH1AZD7JumvUJhZwC52Zh9Oqq7nScP94',
  client_secret: 'F55zivjCEvTuz0Iuempkd43OMlojHq51B8PhvuyS6rm1wmPwSajQfFbHAgyLVvgh5AnZ479ywQmyRPPbWj02P1HaCBHExPFR9vKGHe1k6QIpZClJgJFwbbmJ7gIwFDhWQBE0arYqFjkfDdeKzMah9O1I9gXZZklXdVvHYgXYnqDmflVgb0GuxBolfFMTIiHdjqHBsTt9ctbmryG33PJIhEfGL8hmuO0gVlWe0meRHNrzPpqe0k7CU01g4eRXbG',

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

  _doRequest: function (endpoint, method, params, callback){
    $.ajax({
      url: xiboServices.url_base + endpoint,
      method: method,
      data: params,
      crossDomain: true,
      // headers: {
      //   'Authorization': 'Bearer ' + xiboServices.accessToken
      // }
      beforeSend: function (xhr){
        xhr.setRequestHeader('Authorization', 'Bearer ' + xiboServices.accessToken);
        // xhr.setRequestHeader('ContentType', );
      }
    }).done(function(data){
      callback && callback(data);
    }).fail(function(data){
      console.log(data);
      if (data.code == 401){
        //Expired accessToken
        //Generate new accessToken
        xiboServices.authorize();
      }
    });
  }
}
