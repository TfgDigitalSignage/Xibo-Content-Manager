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
 	let contentFile, originalContentFile

	console.log(`Visualizando cambios en el fichero ` + fileName);

	request.get(url, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        originalContentFile = body;
	    	}
		});


	function pollingFile()
	{
		request.get(url, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	    	//console.log("Realizando comprobacion")
	        contentFile = body;
	        if (contentFile != originalContentFile)
		        {
		        	//console.log("Fichero " + fileName + "cambiado.")
		        	originalContentFile = contentFile;
		        }
	    	}
		});
	}
	setInterval(pollingFile,1000);
}


module.exports = router;