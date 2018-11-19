$(document).ready(main);

/*
var variables = {

  idLayout : 0,
  idPlaylist : 0
  access_token : ''
}
*/

function main(){
 // xiboServices.authorize(function(ret){
  //  console.log(ret.access_token);
  //  xiboServices._doRequest("layout", 'post', 'name=layuot1' ,function (){
  //    alert("SE HA CREADO DEBUTI");
  //   });
  // });

 


  //Add Layout (POST) (/LAYOUT)
  /*
  $.ajax(settingsAddLayout)
  .done(function (response) {
    console.log("Layout añadido con éxito");
    console.log("Id Layout: " + response.layoutId);
    variables.idLayout = response.layoutId,
    console.log("Id Playlist: " + response.regions[0].playlists[0].playlistId);
    variables.idPlaylist = response.regions[0].playlists[0].playlistId,
    console.log(response);
  .fail(function(response){
      if (response.status == 409){
         console.log("ERROR: nombre de layout ya existente");
       } 
   });
   */
   

//Add Widget WebPage (POST) (/PLAYLIST/WIDGET/WEBPAGE/{ṔLAYLISTID})
/*
     $.ajax(settingsAddWidgetWebPage)
      .done(function (response) {
        console.log("Widget añadido con éxito");
        console.log(response);
      })
      .fail(function(response){
        console.log("EROR: widget no añadido");
       });
      })
*/


  //Get Time (GET) (/CLOCK)
  /*
  $.ajax(settings).done(function (response) {
    console.log(response);
   });
   */
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
  //"async": true,
  //"crossDomain": true,
 "url": "http://localhost/api/clock",
  "method": "GET",
  "data": {
        access_token: 'PfUjuEytwo5hteqWHGzlAC04VmIfUGIt9SfUOEur',
      }
 // "headers": {
  // "cache-control": "no-cache",
  // "Authorization": "Bearer lTWEwjxQ1jSEnLkka8HjCauyVnGgwH6TGAkV6x9p"
//  }
}

var settingsAddLayout = {
 "url": "http://localhost/api/layout",
  "method": "POST",
  "data": {
        access_token: 'PfUjuEytwo5hteqWHGzlAC04VmIfUGIt9SfUOEur',
        name: 'prueba'
      }
}


var settingsAddWidgetWebPage = {
  ///api/playlist/widget/webpage/{idPlaylist}
 "url": "http://localhost/api/playlist/widget/webpage/" + variables.idPlaylist,
  "method": "POST",
  "data": {
        access_token: 'PfUjuEytwo5hteqWHGzlAC04VmIfUGIt9SfUOEur',
        uri: 'http://javy.fdi.ucm.es/marco/pantallas/cartel1.jpg',
        modeId: 3,  //1- Open Natively, 2- Manual Position, 3- Best Ft
        useDuration: 1, //1 or 0
        duration: 20
      }
}