const albumSearchForm = document.querySelector('form');
const searchElement = document.querySelector('input');
const searchResults = document.querySelector('#search-results')
const albumList = document.querySelector('#album-section ul');
const albumSort = document.getElementsByClassName('album-options-sort');
const albumTrackImage = document.querySelector('.album-track-image')

let sortParameter = "added";



// this function removes the search results if the parent element is outside the search menu
window.onload = () => {
  //loads albums on window load
  fetchAlbums();
  //adds touch and click events
  document.addEventListener('touchstart', closeSearch, {passive: true})
  document.addEventListener('click', closeSearch, {passive: true})

  //closes the search bar if clicked outside its element
  function closeSearch(e) {
    let parentSection = e.target.closest("section")
    //check if the closest section is not null or the search menu
    if (parentSection !== null && parentSection.id !== 'search-menu') {
      closeSearchSubmenu();
    }
  }
}






// this function fetches the json data and adds the results submited in the search bar
albumSearchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let album = searchElement.value;
  searchResults.style.display = "flex";
  searchResults.innerHTML = '';
  searchResults.innerHTML += '<div class="search-loader"><img src="./img/loader.gif" alt="Loading..."></div>'


  fetch(`/search_one?album=${album}`).then((response) => {
    searchResults.innerHTML = '';
  
    response.json().then((data) => {
      if (data.error !== undefined) {
        searchResults.innerHTML += '<div class="search-error">' +data.error+ '</div>'
      }

      for (let i=0; i < data.length; i++){
        let id = data[i].id
        let image = data[i].images[1].url;
        let name = data[i].name;
        let artist = data[i].artists[0].name;
        let date = data[i].release_date;
        let tracks = data[i].total_tracks;
      
        searchResults.innerHTML += '<div class="search-album">'+
                                      '<div class="search-album-image" style="background-image: url(' +image+ ')" onclick="addSearchSubmenu('+i+')"></div> ' +
                                      '<div class="search-album-info">' +
                                        '<h5>' +name+ ' </h5>' +                                                         
                                        '<p>' +artist+ '</p>' +
                                        '<p> Nº of tracks: ' +tracks+ '</p>' +
                                        '<p> Released </p>' +                                                                      
                                        '<p>' +date+ '</p>' +                                                                      
                                      '</div>' +
                                      '<div class="search-album-add">' +
                                        '<a onclick="addAlbum(\'' +id+ '\')">Add Album</a>'
                                      '</div>' +
                                    '</div>';
      }     
    }) 
  })
});




// this function fetches the album info by id and adds the album to the collection in local storage
function addAlbum(id) {

  fetch(`/search_two?id=${id}`).then((response) => {
    response.json().then((data) => {   

      var album = {
        id,
        name: data.name,
        image: data.images[1].url,
        artist: data.artists[0].name,
        date: data.release_date,
        numberSongs: data.total_tracks,
        popularity: data.popularity,       
        label: data.label,
        copyrights: data.copyrights[0].text,
        tracks: data.tracks.items,
        albumDuration: 0
      }

      // to get the total number of minutes in the album
      for(let i = 0; i < (album.tracks.length); i++){
        //convesrts each song in the track to minutes
        let songTime = (data.tracks.items[i].duration_ms/60000);
        //adds the duration to the album object
        album.albumDuration += songTime;
      }


    //test if local storage doesn't have an album object
    if (localStorage.getItem('spotify-albums') === null) {
      //create an album array
      let spotifyAlbum = [];

      //add the current album to the local storage album array
      spotifyAlbum.push(album);
      localStorage.setItem('spotify-albums', JSON.stringify(spotifyAlbum))
      
      fetchAlbums();
    } else {
      //gets the albums from local storage
      let spotifyAlbum = JSON.parse(localStorage.getItem('spotify-albums'))
      //checks if the album id exists in local storage
      let verifyAlbum = spotifyAlbum.some((item) => item.id.includes(album.id))
      
      if (!verifyAlbum) {
        //add the current album to the local storage album array
        spotifyAlbum.push(album);
        localStorage.setItem('spotify-albums', JSON.stringify(spotifyAlbum))

        console.log('album added')

        fetchAlbums();
      } else {
        
        console.log('album already exists')
        
      }
    }
    })
  })
}














// this function opens the add option for the albums
function addSearchSubmenu (i) {
  let searchAlbum = document.querySelectorAll('.search-album')

  for (let j =0; j < searchAlbum.length; j++) {
    let searchAdd = searchAlbum[j].querySelector('.search-album-add');

    if ( j === i ) {
      if (searchAdd.style.display === 'block' ) {
        searchAdd.style.display = 'none';
      } else {
        searchAdd.style.display = 'block';
      }
    } else {
      searchAdd.style.display = 'none';
    }
  }
}


//this function closes the search sub menu
function closeSearchSubmenu(){
  searchResults.style.display = "none";
  //reset the album search
  albumSearchForm.reset();
}




//fetch Albums from local storage and load them to the page
function fetchAlbums() {  
  closeSearchSubmenu();
  
  //get albums from local storage
  let localAlbums = JSON.parse(localStorage.getItem('spotify-albums'));
  //sorts by the search parameter set as a global variable
  localAlbums.sort((a, b) => (a[sortParameter] > b[sortParameter] ) ? 1 : -1)
  //checks for the div with the sort parameter and changes it's background color
  Array.from(albumSort).forEach((e) => e.innerHTML === sortParameter ? e.style.background = `rgb(52, 63, 68)` : e.style.background = `grey`)
 
  //clears the content of the album;
  albumList.innerHTML = '';
  
  if (localAlbums !== null) {
    for (let i = 0; i < localAlbums.length; i++) {
      let id = localAlbums[i].id
      let name = localAlbums[i].name
      let image = localAlbums[i].image
      let artist = localAlbums[i].artist
      let releaseDate = localAlbums[i].date
      let numberSongs = localAlbums[i].numberSongs
      let popularity = localAlbums[i].popularity
      let albumDuration = localAlbums[i].albumDuration
      let label = localAlbums[i].label

      albumList.innerHTML +=  '<li class="album-list-item">'+
                                '<div class="list-item-info">' +
                                  '<div class="item-image" style="background-image: url(' +image+ ')"></div> ' +
                                  '<div class="item-info">' +
                                    '<p>' +name+ '</p>'+
                                    '<p> Album by ' +artist+ '</p>'+
                                    '<p> Nº of Songs: ' +numberSongs+'</p>'+
                                    '<p> Popularity: ' +popularity+'</p>'+
                                    '<p> Album Duration: ' +albumDuration.toFixed(0)+'m</p>'+
                                    '<p> Released: ' +releaseDate+ '</p>'+                          
                                    '<p>' +label+ '</p>'+
                                    '<a onclick="deleteAlbum(\''+id+'\')" class="list-item-delete" href="#"><i></i></a> ' +
                                  '</div>' +
                                '</div>' +                                                    
                                '<div class="list-item-tracks"></div>' +
                              '</li>';
    }  
  } 

  //selects all items added
  const albumListItems = document.querySelectorAll('.album-list-item')
  //this function loops trought all items and adds an event listener to each
  Array.from(albumListItems).forEach((item, i) => { 
    //adds an event listener to every album in the list
    item.querySelector('.list-item-info').addEventListener('click', (e) => showTracks(e, albumListItems, localAlbums[i]))

    //populates the albums with the number of tracks per each
    for(let j = 0; j < localAlbums[i].tracks.length; j++ ){
      let tracksList = item.querySelector('.list-item-tracks');
      let songTime = (localAlbums[i].tracks[j].duration_ms / 60000)
      
      tracksList.innerHTML += '<p>'+(j+1)+ '- ' +localAlbums[i].tracks[j].name + 
                                '<a class="track-time">' + songTime.toFixed(2)+ ' minutes</a>' + 
                              '</p>';
    }
  })
}







//this function loops through the albums list and closes all except the one clicked
function showTracks(item, list, album) { 

  albumTrackImage.style = `background: url(${album.image}); background-size: cover;` 
  
  for (let j = 0; j < list.length; j++) {  
    let itemTrack = list[j].querySelector('.list-item-tracks')


    if (item.target.closest("li") === list[j]) {
      itemTrack.style.display === "flex" ? itemTrack.style.display = "none" : itemTrack.style.display = "flex"
    } else {      
      itemTrack.style.display = "none"
    }
  }  
}






//this function gets the albums from local storage and deletes the one matching the id
function deleteAlbum(id) {
  //get the albums from local storage
  let localAlbums = JSON.parse(localStorage.getItem('spotify-albums'));
  //loop through the albums
  for (let i = 0; i < localAlbums.length; i++) {
    if(localAlbums[i].id === id){
      //remove this album from the list
      localAlbums.splice(i, 1);
    }
  }
  //re-set the local storage with the new values
  localStorage.setItem('spotify-albums', JSON.stringify(localAlbums))
  //re-load the albums in the collection
  fetchAlbums();
}


function changeSortParameter(type) {
  sortParameter = type;
  fetchAlbums();
}