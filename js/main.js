$(document).ready(function(){
  $('#proccesButton').click(main.onProccesButton);
});

var main = {

  dataSource: '', //JSON with data
  idLayout : '',
  idPlaylist : '',


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
  // $.ajax(settings).done(function (response) {
  //   console.log(response);
  //  });

onProccesButton: function (){
  var url = $('#urlField').val();
  if (url){
    localServices._getJSON(url,function(data){
      //Call Xibo Service
      main.dataSource = data; //Save json instance
      xiboServices.authorize(function(ret){
        var layoutParams = {
          name: 'TestLayout',
          access_token: xiboServices.accessToken
        }
        xiboServices._doRequest('layout', 'POST', layoutParams, function(data){
          main.idLayout = data.layoutId;
          main.idPlaylist = data.regions[0].playlists[0].playlistId;
          main.mainFlow();
        }, function(data){
          if (data.status === 409){
            //If Layout already exists
            var layoutParams = {
              layout: 'TestLayout',
              access_token: xiboServices.accessToken
            }
            //Get layout by name
            xiboServices._doRequest('layout', 'GET', layoutParams, function(data){
              main.idLayout = data.layoutId;
              main.mainFlow();
            }, null, null);
          }
        }, null);
      });
    });
  }
},

mainFlow: function(){
  var baseUri = this.dataSource.baseUrl;
  var playList = this.dataSource.playlist;
  for (i in playList){
      var addWidgetParams = {
        access_token: xiboServices.accessToken,
        uri: baseUri + playList[i].url,
        modeId: 3,  //1- Open Natively, 2- Manual Position, 3- Best Ft
        useDuration: function(){
          if (playList[i].duration)
            return 1;
          else
            return 0;
        }, //1 or 0
        duration: function(){
          if (playList[i])
            return parseInt(playList[i].duration)
          else
            return  undefined;
          }
      };
      xiboServices._doRequest('playlist/widget/webpage/'+this.idPlaylist, 'POST', addWidgetParams, function(data){
        console.log("Element added succesfully " + data);
      }, function(data){
        console.log("Error on add widget, data: " + data);
      }, null);
  }
}

// var settings = {
//   //"async": true,
//   //"crossDomain": true,
//  "url": "http://localhost/xibo/api/clock",
//   "method": "GET",
//   "data": {
//         access_token: xiboServices.access_token,
//       }
//  // "headers": {
//   // "cache-control": "no-cache",
//   // "Authorization": "Bearer lTWEwjxQ1jSEnLkka8HjCauyVnGgwH6TGAkV6x9p"
// //  }
// }

// var settingsAddLayout = {
//  "url": "http://localhost/api/layout",
//   "method": "POST",
//   "data": {
//         access_token: 'PfUjuEytwo5hteqWHGzlAC04VmIfUGIt9SfUOEur',
//         name: 'prueba'
//       }
// }
//
//
// var settingsAddWidgetWebPage = {
//   ///api/playlist/widget/webpage/{idPlaylist}
//  "url": "http://localhost/api/playlist/widget/webpage/" + variables.idPlaylist,
//   "method": "POST",
//   "data": {
//         access_token: 'PfUjuEytwo5hteqWHGzlAC04VmIfUGIt9SfUOEur',
//         uri: 'http://javy.fdi.ucm.es/marco/pantallas/cartel1.jpg',
//         modeId: 3,  //1- Open Natively, 2- Manual Position, 3- Best Ft
//         useDuration: 1, //1 or 0
//         duration: 20
//       }
// }
}
