const request = require('request');

const albumSearch = (token, album, callback) => {
  
  var options = {
    url: `https://api.spotify.com/v1/search?q=${album}&type=album&limit=5`,
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
        albums: response.body.albums.items
      })  
    }
  });



}




module.exports = albumSearch;