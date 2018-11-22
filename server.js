//Import NodeJs modules
var http = require('http');
var url  = require('url');
var fs = require('fs'); //Server local file system

//Cosntant(host:port)
const HOSTNAME = '127.0.0.1';
const PORT = 3000;
//Start service listening at PORT
//The function within handles requests and responses
http.createServer(function(req,res){
  var q = url.parse(req.url, true); //Get url query
    var fileName = "." + q.pathname;  //Try find html file with that name in local file system
  if (fileName === "./") fileName = "./index.html";
  fs.readFile(fileName, function(err, data){ //Read file
      if (err){ //If error
        res.writeHead(404, {'Content-Type':'text/html'});
        return res.end('404 Not Found');
      } //If success
      res.writeHead(200, {'Content-Type':'text/html'}); //Server sends http header code 200 (success)
      res.write(data);  //Server writes html content from the file
      return res.end(); //Close connection
  });
}).listen(PORT);
