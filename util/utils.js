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

exports.getIpv4LocalAddress = requestObj => {
  const addr = requestObj.connection.localAddress !== "::1" ? requestObj.connection.localAddress: "localhost"
  const port = requestObj.connection.localPort
  return "http://" + addr + ":" + port
}