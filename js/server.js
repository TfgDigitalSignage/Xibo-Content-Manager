var http = require('http');
var url = require('url');
const port = 3000;

/**
 * init - Main entry server's sfunction
 *
 * @param  {Object} router Request router object
 * @param  {function} handler function
 */
function init(router, handler){
  function onRequest(req, resp){
    var path = url.parse(req.url).pathname;
    router.route(handler, path, req, resp);
  }
  http.createServer(onRequest).listen(port);
  console.log("----- SERVER LISTENING AT PORT " + port + " -----");
}

exports.initServer = init
