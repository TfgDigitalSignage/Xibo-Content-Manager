$(document).ready(main);

function main(){
  //xiboServices.addLayout("MyLayout");
  //xiboServices.authorize(onSucces);
  xiboServices._doRequest("layout", 'GET', '' ,function (){
    alert("SE HA CREADO DEBUTI");
  });
}

function onProccesButton (){
  var url = $('#urlField').val();
  if (url){
    localServices._init(url, 'json', 'get');
    localServices._doRequest (onSucces);
  }
}

function onSucces (data){
  //$('#test').append('<p>' + JSON.stringify(data.playlist[2]) + '</p>');
  //Call Xibo Services
  xiboServices.whatTimeIsIt();
}
