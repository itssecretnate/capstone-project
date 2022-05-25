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
  

  const [disableButton, setDisableButton] = useState(false);
  const [isWatched, setIsWatched] = useState(date_watched ? true : false);
  const [isUpcoming] = useState(release_date ? true : false);

  const addToList = () => {
    axios.post('/api/movies', {title, poster, year, imdb_id})
    .then(res => {
      setDisableButton(true);
      console.log(res.data);
    })
  }

  const removeFromList = () => {
    axios.delete('/api/watchlist', {data: {title}})
    .then(res => {
      updateList();
      console.log(res.data);
    })
  }

  const markWatched = () => {
    axios.put('/api/watchlist', {title})
    .then(res => {
      console.log(res.data);
      setIsWatched(true);
      updateList();
    })
  }

  const buttons = () => {
    if(previewOnly === 'true') return;
    else {
      if(watchListItem) return (
      <div className='watchListItemButtons'>
      <button className='movieCardButton' disabled={isWatched || isUpcoming} onClick={markWatched}>Watched</button>
      <button className='movieCardButton' disabled={isWatched} onClick={removeFromList}>Remove</button>
      </div>) 

      else return (
      <button className='movieCardButton' id='singleMovieButton' disabled={disableButton} onClick={addToList}>Add to list</button>)
    }
  }

  const upcoming = () => {
    if(release_date) {
      return (<h3>Releases: {new Date(release_date).toLocaleDateString().toString()}</h3>)
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