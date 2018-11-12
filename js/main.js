function onProccesButton (){
  var url = $('#urlField').val();
  if (url){
    localServices._init(url, 'json', 'get');
    localServices._doRequest (onSucces);
  }
}

function onSucces (data){
  //callback for getJson succes
  $('#test').append('<p>' + JSON.stringify(data) + '</p>');
  //Call Xibo Services
  //...
}
