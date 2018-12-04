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
  fs.readFile('view/RemoteContent.html', function(err, content){
    if (err)
      throw err;
    response.writeHeader(200, {'Content-Type':'text/html'});
    response.write(content);
    response.end();
  });
}

function getRemoteData (){
  var queryString = require('querystring');
  var services = require('./httpXiboRequest');

  var accessToken = '';
  var content = {};

  services.xibo_getAccessToken(function(data){
    accessToken = data['access_token'];
    services.getJsonData (function(body){
      content = body;

    });
  });
}

exports.index = getIndex
exports.remoteDataLoader = remoteDataLoader
exports.getRemoteData = getRemoteData
