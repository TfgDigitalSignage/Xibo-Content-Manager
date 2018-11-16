$(document).ready(main);

function main(){
  //xiboServices.addLayout("MyLayout");
  // xiboServices.authorize(function(ret){
  //   console.log(ret.access_token);
  //   xiboServices._doRequest("clock", 'get', '' ,function (){
  //     alert("SE HA CREADO DEBUTI");
  //   });
  // });
  $.ajax(settings).done(function (response) {
    console.log(response);
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

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://localhost/xibo/api/clock",
  "method": "GET",
  "headers": {
    "cache-control": "no-cache",
    "Authorization": "Bearer jhDlnbm2Wo1IdINT0TIcH2Yb15StBrsIiofjDBi1"
  }
}
