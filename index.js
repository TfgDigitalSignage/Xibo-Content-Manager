var server = require('./js/server');
var router = require('./js/router');
var requestHandler = require('./js/requestHandlers');

//Associative array to assign each requested path with its corresponding handler
var handle = {}
handle['/']                            = requestHandler.index;
handle['/RemoteContent/']              = requestHandler.remoteDataLoader;
handle['/getRemoteData'] = requestHandler.getRemoteData;
handle['/prueba'] = requestHandler.prueba;

//Init Server
server.initServer(router, handle);