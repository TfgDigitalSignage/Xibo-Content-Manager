const path = require('path');
const express = require('express');

const router = express.Router();

const root = path.dirname(require.main.filename);
const polling_path = path.join(root, 'view', 'Polling.pug');

router.get('/Polling', (req,res,next) => {
    res.render(polling_path);
});

router.get('/pollingLocalFile', (req,res,next) => {
	pollingLocalFile();
    res.redirect('/');
});

router.post('/pollingRemoteFile', (req,res,next) => {
	pollingRemoteFile(req, res, next);
    res.redirect('/');
});


function pollingLocalFile(response)
{
  	console.log('\nPolling a file: \n');

  	let fileContent;
  	let fs = require('fs');
 	let filePath = '/../resources/file.json';
 	let fileName = 'file.json';

	fileContent = fs.readFileSync(__dirname + filePath, 'utf-8');
	let json = JSON.parse(fileContent); 

	require('log-timestamp');
	console.log(`Visualizando cambios en el fichero ${fileName}`);

	fs.watchFile(__dirname + filePath, (curr, prev) => {
	  console.log(`${fileName} ha cambiado`);
	});

}

//En desarrollo
function pollingRemoteFile(req, res, next)
{
  	console.log('\nPolling a file: \n');

  	let fs = require('fs');
  	let request = require('request');

 	let url = req.body.urlName;
 	const fn = url.split('/');
 	let fileName = fn[fn.length-1];
 	let contentFile

	request.get(url, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        contentFile = body;
	    }
	});

	require('log-timestamp');
	console.log(`Visualizando cambios en el fichero ` + fileName);

/*

	// Import the watching library
	let watchr = require('watchr')
	 
	// Define our watching parameters
	let path = url;
	function listener (changeType, fullPath, currentStat, previousStat) {
	    switch ( changeType ) {
	        case 'update':
	            console.log('the file', fullPath, 'was updated', currentStat, previousStat)
	            break
	        case 'create':
	            console.log('the file', fullPath, 'was created', currentStat)
	            break
	        case 'delete':
	            console.log('the file', fullPath, 'was deleted', previousStat)
	            break
	    }
	}
	function next (err) {
	    if ( err )  return console.log('watch failed on', path, 'with error', err)
	    console.log('watch successful on', path)
	}
	 
	// Watch the path with the change listener and completion callback
//	let stalker = watchr.open(path, listener, next)
	 
	// Close the stalker of the watcher
//	stalker.close()

	// Create the stalker for the path
	stalker = watchr.create(path)
	 
	// Listen to the events for the stalker/watcher
	// http://rawgit.com/bevry/watchr/master/docs/index.html#watcher
	stalker.on('change', listener)
	stalker.on('log', console.log)
	stalker.once('close', function (reason) {
	    console.log('closed', path, 'because', reason)
	    stalker.removeAllListeners()  // as it is closed, no need for our change or log listeners any more
	})
	 
	// Set the default configuration for the stalker/watcher
	// http://rawgit.com/bevry/watchr/master/docs/index.html#Watcher%23setConfig
	stalker.setConfig({
	    stat: null,
	    interval: 5007,
	    persistent: true,
	    catchupDelay: 2000,
	    preferredMethods: ['watch', 'watchFile'],
	    followLinks: true,
	    ignorePaths: false,
	    ignoreHiddenFiles: false,
	    ignoreCommonPatterns: true,
	    ignoreCustomPatterns: null
	})
	 
	// Start watching
	stalker.watch(next)
	 
	// Stop watching
	stalker.close()
*/
/*
	let http = require('http');
	let options = {method: 'HEAD', host: 'http://147.96.96.25', port: 3000, path: '/public/PruebaJSON'};
	let req = http.request(options, function(res) {
	    console.log(res.headers);
	  }
	);
	req.end();
*/
/*
	fs.watchFile(url, (curr, prev) => {
	  console.log(fileName + ' ha cambiado');
	});
*/
 /*
 function(url,callback){
    request(url).on('data',(data) => {
        try{
            var json = JSON.parse(data);    
        }
        catch(error){
            callback("");
        }
        callback(json);
    })
}
 */
 /*
  	let fileContent;
  	let fs = require('fs');
 	let filePath = '/../resources/file.json';
 	let fileName = 'file.json';

	fileContent = fs.readFileSync(__dirname + filePath, 'utf-8');
	let json = JSON.parse(fileContent); 

	require('log-timestamp');
	console.log(`Visualizando cambios en el fichero ${fileName}`);

	fs.watchFile(__dirname + filePath, (curr, prev) => {
	  console.log(`${fileName} ha cambiado`);
	});
*/
}


module.exports = router;