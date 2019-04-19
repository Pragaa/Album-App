const request = require('request')


const getAlbum = (token, id, callback) => {

  var options = {
    url: `https://api.spotify.com/v1/albums/${id}`,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    json: true
  };
  request.get(options, function(error, response) {
    if(error) {
      callback('unable to connect to Spotify')
    } else {
      callback(undefined, {
        album: response.body
      })  
    }
  });


}


module.exports = getAlbum;