const request = require('request');


const getToken = (callback) => {

  var client_id = 'b48a6aaf58ec4825aa7fbbe04c7d057d'; 
  var client_secret = '5842d7b32ca74c3895b62e99253beaf0'; 

  // Aplication request authorization object
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if(error) {
      callback('unable to connect to Spotify')
    }

    if (!error && response.statusCode === 200) {
      //the callback returns the Spotify Web API Token 
      callback(undefined, {
        token: body.access_token
      })
    }
  });
}




module.exports = getToken;