exports.getBase64Token = (user, pass) =>{
    return Buffer.from(user+':'+pass).toString('base64')
}

exports.getJsonData = (url, callback) =>{
    request.get (url, function(err, res, body){
      if (err)
        throw new Error (err);
      callback && callback (body);
    });
}