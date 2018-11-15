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
  url_base: 'http://localhost/xibo/api/',
  accessToken: '',
  client_id: 'G9QF9y7gbSfnmhfoFsfc2zZD2nBJeeKIHUXpLYEj',
  client_secret: 'vWTTgO33E1Hpgw0gM8DUkqF7lTlLGPJNBkznS9O2tUatjPewEQwYpePGJW8gvVgGpniF4fAmMCJRuUKfePKdy9uF2Pe2iJmksNm6dHosoaj9vCzVYG5omkucvWOAqchchcX1kSeLaZA8IkBAb6xdS4Qol3flE73guxgoqXiiiq3WlDuAuUwgAW3iKt6bWDaWnRpFgr4oM1VjIfxd85yHH9v5POHubJwrYLul3Sex040UlEjrcfCpoc59or85DD',
  //client_id_adri:
  //client_secret_adri:

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
      xiboServices.accessToken = value;
      callback & callback();
    });
  },

  whatTimeIsIt: function (){
    $.ajax({
      url: xiboServices.url_base+'clock',
      method: 'get',
      data: {
        Authorization: 'Bearer ' + xiboServices.accessToken.access_token
      }
    }).done(function(data){
      $('#test').append('<p>' + JSON.stringify(data.time) + '</p>');
    });
  },

  //This method add a new Layout
  addLayout: function (name){
    var formData = {"name":name};
    $.ajax({
      url: xiboServices.url_base,
      method: 'post',
      dataType : 'json',
      data: formData
    })
    .done(function (data){
      console.log('Layout created!');
    })
    .error(function(data){
      console.log('Error: ' + data);
    });
  }
}
