//NodeJs request module
var request = require ('request');
var xiboOptions = {

    url_base: 'http://localhost/xibo/api',
    path: '',
    method: '', //{GET,POST,PUT,DELETE}
    headers: {},
    params: {},
    callback: '',

    client_id: 'G9QF9y7gbSfnmhfoFsfc2zZD2nBJeeKIHUXpLYEj',
    client_secret: 'vWTTgO33E1Hpgw0gM8DUkqF7lTlLGPJNBkznS9O2tUatjPewEQwYpePGJW8gvVgGpniF4fAmMCJRuUKfePKdy9uF2Pe2iJmksNm6dHosoaj9vCzVYG5omkucvWOAqchchcX1kSeLaZA8IkBAb6xdS4Qol3flE73guxgoqXiiiq3WlDuAuUwgAW3iKt6bWDaWnRpFgr4oM1VjIfxd85yHH9v5POHubJwrYLul3Sex040UlEjrcfCpoc59or85DD'
    //CLIENT INFO ADRI
    // client_id: 'CE2KNI8jSH1AZD7JumvUJhZwC52Zh9Oqq7nScP94',
    // client_secret: 'F55zivjCEvTuz0Iuempkd43OMlojHq51B8PhvuyS6rm1wmPwSajQfFbHAgyLVvgh5AnZ479ywQmyRPPbWj02P1HaCBHExPFR9vKGHe1k6QIpZClJgJFwbbmJ7gIwFDhWQBE0arYqFjkfDdeKzMah9O1I9gXZZklXdVvHYgXYnqDmflVgb0GuxBolfFMTIiHdjqHBsTt9ctbmryG33PJIhEfGL8hmuO0gVlWe0meRHNrzPpqe0k7CU01g4eRXbG'
    //CLIENT INFO DANI
    // client_id: 'Aw8RNRb5AEqmS7B8C5ipq5XcV40LxagxnD41sCmg',
    // client_secret: '6gWsZef5ajJiTKmuPiQB56vCrlVQi86o0DqxTiKZyzu1XpzX4jzSug5BPRmnTFbjLDgcVVXTFsO0594mp1e07qAgvMxAjiEt1Yo83bYy4G6YgUD0EPKDJPGzIdhqUhc8iD7WyExfj9oDLauG2R4n0um5cMUEPVNI3ZvOOkJPoTXsV8K6xmA25Jscif3ZOncUQ5ivCfordmIlg0C5IHTVIjWGn9EyXGNECLsIZLBGAKwka3Eq01MqRKpPnR9u7F'

}

function xiboAuthorize (callback){
  var options = {
    method: 'POST',
    url: "http://localhost/xibo/api/authorize/access_token",
    // path: '/authorize/access_token',
    headers:{},
    form: {
      grant_type: 'client_credentials',
      client_id: xiboOptions.client_id,
      client_secret: xiboOptions.client_secret
     }
   };

  request(options, function (error, response, body) {
    if (error){
      console.log("FATAL ERROR: " + error);
      throw new Error(error);
    }
    else
      callback & callback(body);
  });
}

exports.xiboAuthorize =  xiboAuthorize
