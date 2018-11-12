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
}
