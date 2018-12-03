$(document).ready(function(){
  $('#proccesButton').click(main.onProccesButton);
});

var main = {

  dataSource: '', //JSON with data
  idLayout : '',
  idPlaylist : '',

onProccesButton: function (){
  //Load LayoutName from form
  var layoutName = $('#layoutName').val();
  if (!layoutName)
    layoutName = 'TestLayout';
  //Load Url json from form
  var url = $('#urlField').val();
  if (url){
    localServices._getJSON(url,function(data){
      //Call Xibo Service
      main.dataSource = data; //Save json instance
      xiboServices.authorize(function(ret){
        var layoutParams = {
          name: layoutName,
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
        alert("EJECUTADO CORRECTAMENTE");
      }, function(data){
        console.log("Error on add widget, data: " + data);
      }, null);
  }
}

}
