/**
 * route - Routes url path to link with concrete handler
 *
 * @param  {function} handler handler function
 * @param  {string} path    url pathname to route (request)
 * @param  {Object} res     server's response object
 */
function route (handler, path, req, res){
  if (typeof handler[path] === 'function'){
    switch (req.method) {
      case 'GET':
        handler[path](res);
        break;
      case 'POST':
        dataparser = require ('./formDataParser');
        dataparser.parsePostData (req, function(data){
          handler[path](req, res, data);
        });
        break;
      default:
    }
  }
  else{
    if (path !== '/favicon.ico')
      console.log("There is no defined handler for request to " + path);
    res.writeHeader(404, {'Content-Type':'text/html'});
    res.write('<h1>404 Not found<h1>');
    res.write('Resource not found');
    res.end();
  }
}

exports.route = route
