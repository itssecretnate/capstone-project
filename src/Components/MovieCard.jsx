import React, {useState} from 'react'
import axios from 'axios'

function MovieCard(props) {
    
  // Currently using this for fallback. Need to see if there's a way to remove this.
  const fallbackData = {
      title: 'Missing Title',
      poster: 'https://via.placeholder.com/540x800?text=Missing+Poster',
      year: 'Missing Year',
      imdb_id: 'undefined',
      date_watched: ''
  }
  
  const {watchListItem, updateList, previewOnly} = props;

  
  const {title, poster, release_year: year, imdb_id, date_watched, release_date} = (props.movie !== undefined) ? props.movie : fallbackData;

  if(props.movie === undefined) console.log(`${props.movie} is undefined.`)
  

  const [disableButton, setDisableButton] = useState(false);
  const [isWatched, setIsWatched] = useState(date_watched ? true : false);
  const [isUpcoming] = useState(release_date ? true : false);

  const addToList = () => {
    axios.post('http://localhost:9001/movies', {title, poster, year, imdb_id})
    .then(res => {
      setDisableButton(true);
      console.log(res.data);
    })
  }

  const removeFromList = () => {
    axios.delete('http://localhost:9001/watchlist', {data: {title}})
    .then(res => {
      updateList();
      console.log(res.data);
    })
  }

  const markWatched = () => {
    axios.put('http://localhost:9001/watchlist', {title})
    .then(res => {
      console.log(res.data);
      setIsWatched(true);
      updateList();
    })
  }

  const buttons = () => {
    if(previewOnly === 'true') return;
    else {
      if(watchListItem) return (<><button disabled={isWatched} onClick={removeFromList}>Delete</button> <button disabled={isWatched || isUpcoming} onClick={markWatched}>Watched</button></>) 
      else return (<button id='movieCardButton' disabled={disableButton} onClick={addToList}>Add to list</button>)
    }
  }

  const upcoming = () => {
    if(release_date) {
      // setIsWatched(true);
      return (<p>Release: {new Date(release_date).toLocaleDateString().toString()}</p>)
    }
  }

  return (
    <div className='movieCard' style={{backgroundImage: `url(${poster ? poster : fallbackData.poster})`}}>

      <div className='movieDetails'>
          <h2><b>{title ? title : fallbackData.title}</b></h2>
          <h3><b>{year ? year : fallbackData.year}</b></h3>
          {date_watched && <p>Watched: {new Date(date_watched).toLocaleDateString().toString()}</p>}
          {
            buttons()
          }
          {
            upcoming()
          }
      </div>


    </div>
  )
}

export default MovieCard