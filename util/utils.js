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

exports.getLocalAddress = () => {
  let promise = new Promise((resolve,reject)=>{
    require('dns').lookup(require('os').hostname(), (err, add) => {
      const address = !err ? "http://"+add: "http://localhost";
      const port = process.env.SERVER_PORT || 3000;
      resolve(address+":"+port);
    })
  })
  return promise
}