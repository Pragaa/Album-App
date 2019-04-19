const express = require('express');
const path = require('path');

const apiToken = require('./utils/Api-Token')
const albumSearch = require('./utils/Api-Search')
const albumInfo = require('./utils/Api-Album')

const app = express();
const port = process.env.PORT || 3000;





/******************/
/* Configurations */
/******************/
app.set('view engine', 'ejs'); //defines the html renderer
app.set('views', path.join(__dirname, '../views')) //defines the directory for the views folder

app.use(express.static(path.join(__dirname, '../public'))) //defines the public folder as the root for static files





/**********/
/* Routes */
/**********/
app.get('/', (req, res) => {
  res.render('home.ejs');
})





//acess to spotify app to retrieve albums
app.get('/search_one', (req, res) => {
  if(!req.query.album) {
    return res.send({ error: 'album must be provided'})
  }
  //requests the token from the Spotify Api
  apiToken((error, data) => {
    if (error) {
      return res.send({ error }) 
    }
    //searches album based on the name provided in the query string
    albumSearch(data.token, req.query.album, (error, data) => {
      if (error) {
        return res.send({ error })
      } else if (data.albums.length == 0) {
        //throws an error if no data was found
        return res.send({ error: 'no results found'})
      }

      res.send(data.albums)
    })
  }) 
})


app.get('/search_two', (req, res) => {
  
  //requests the token from the Spotify Api
  apiToken((error, data) => {
    if (error) {
      return res.send({ error }) 
    }

    albumInfo(data.token, req.query.id, (error, data) => {
      if (error) {
        return res.send({ error })
      }

      res.send(data.album)
    })
  })
})












app.listen(port, () => {
  console.log(`Server is up on port ${port}.`)
})






