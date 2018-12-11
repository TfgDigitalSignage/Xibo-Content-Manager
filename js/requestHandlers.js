/**
 * getIndex - This handler loads Index.html
 *
 * @param  {Object} response Server's response object
 */
function getIndex (response){
  var fs = require('fs');
  fs.readFile('view/index.html', function(err, content){
    if (err)
      throw err;
    response.writeHeader(200, {'Content-Type':'text/html'});
    response.write(content);
    response.end();
  });
}

/**
 * remoteDataLoader - This handler gets data from json and sets content found
 * into a Xibo layout (previosly created)
 *
 * @param  {Object} response Server's response object
 */
function remoteDataLoader (response){
  console.log('Remote Data loader called');
  var fs = require('fs');
  fs.readFile('view/RemoteContent.html', function(err, content){
    if (err)
      throw err;
    response.writeHeader(200, {'Content-Type':'text/html'});
    response.write(content);
    response.end();
  });
}

function getRemoteData (req, res, formdata){
  //IMPORTS
  var services = require('./httpXiboRequest');
  var formParser = require('./formDataParser');

  var accessToken = '';
  var content = {};
  var dataSource = formdata.DataUri;
  var layoutName = formdata.LayoutName;
  if (dataSource && layoutName){
    //Gets data from dataSource
    services.getJsonData (dataSource, function(body){
      content = JSON.parse(body);
      //Authenticates
      services.xibo_getAccessToken(function(data){
        accessToken = data['access_token'];
        //Tries to add a new layout
        services.postLayout (accessToken, layoutName, function(response){
          if (response.statusCode === 409)
          {
            res.writeHeader(200, {'Content-Type':'text/html'});
            res.write('<h1>Ya existe un layout con ese nombre; Por favor, escoja otro<h1>');
            res.end();
          }
          else if (response.statusCode === 201){
            var _data = JSON.parse(response.body);
            var idPlaylist = _data.regions[0].playlists[0].playlistId;
            var dataToAdd = content.playlist;

            insertWidgets(content, idPlaylist, dataToAdd, function (res){
              showResult(res);
            });

            function insertWidgets (content, idPlaylist, dataToAdd, callback){
              var final = true;
              for (i in dataToAdd){
                var url = content.baseUrl + dataToAdd[i].url;
                //Tries to add content from dataSource into layout's playlist
                services.postWidgetWebContent(idPlaylist, accessToken, url, 3, function(){
                  if (dataToAdd[i].duration) return true;
                  else return false;
                }, function(){
                  if (dataToAdd[i].duration) return parseInt(dataToAdd[i].duration);
                  else return undefined;
                }, function(response){
                  if (response.statusCode !== 201){
                    console.log("Cannot add " + dataToAdd[i].url + " to playlist");
                    final = false;
                  }
                });
              }
              callback & callback(final);
            }

            function showResult (final){
                //Final Result
                if (final){
                  res.writeHeader(200, {'Content-Type':'text/html'});
                  res.write('<h1>Layout creado satisfactoriamente<h1>');
                  res.end();
                }
                else{
                  res.writeHeader(200, {'Content-Type':'text/html'});
                  res.write('<h1>Algunos contenidos no se han podido añadir al Layout. Por favor, reviselos manualmente<h1>');
                  res.end();
                }
            }
          }
          else {
            res.writeHeader(200, {'Content-Type':'text/html'});
            res.write('<h1>No se ha podido crear el layout ' + layoutName + '<h1>');
            res.end();
          }
        });
      });
    });
  }
}

function prueba(req, res, data){
  res.writeHeader(200, {'Content-Type':'text/html'});
  res.write(data.dataUri + " " +data.layoutName);
  res.end();
}

exports.index = getIndex
exports.remoteDataLoader = remoteDataLoader
exports.getRemoteData = getRemoteData
exports.prueba = prueba
