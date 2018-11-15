$(document).ready(main);

// Esto es una prueba

function main(){
  //xiboServices.addLayout("MyLayout");
  xiboServices.authorize(onSucces);

}

function onProccesButton (){
  var url = $('#urlField').val();
  if (url){
    localServices._init(url, 'json', 'get');
    localServices._doRequest (onSucces);
  }
}

function onSucces (data){
  //callback for getJson succes
  //$('#test').append('<p>' + JSON.stringify(data.playlist[2]) + '</p>');
  //Call Xibo Services
  xiboServices.whatTimeIsIt();
}
