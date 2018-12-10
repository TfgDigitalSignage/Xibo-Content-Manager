var qs = require('querystring');

function parsePostData (request, callback){
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  if(request.headers['content-type'] === FORM_URLENCODED) {
      let body = '';
      request.on('data', chunk => {
          body += chunk.toString();
      });
      request.on('end', () => {
          callback & callback(qs.parse(body));
      });
  }
  else {
      callback(null);
  }
}

exports.parsePostData = parsePostData
