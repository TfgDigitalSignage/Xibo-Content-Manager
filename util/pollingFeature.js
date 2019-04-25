
module.exports = {
    pollingLocalFile: (response)=>{
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
    },
    
    pollingRemoteFile: (url, callback)=>{
        let fs = require('fs');
        let request = require('request');

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
                        callback(contentFile)
                        originalContentFile = contentFile;
                    }
                }
            });
        }
        setInterval(pollingFile,1000);
    },

    getJsonData = (url, callback) =>{
        request.get (url, function(err, res, body){
          if (err)
            throw new Error (err);
          callback && callback (body);
        });
    }
}