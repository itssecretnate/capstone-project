import React from 'react'

function MovieCard(props) {
    
    // Currently using this for fallback. Need to see if there's a way to remove this.
    const fallbackData = {
        title: 'Missing Title',
        poster: 'https://via.placeholder.com/540x800?text=Missing+Poster',
        year: 'Missing Year'
    }

    const {title, poster, year} = (props.movie !== undefined) ? props.movie : fallbackData;

  return (
    <div className='movieCard' style={{backgroundImage: `url(${poster !== 'N/A' ? poster : fallbackData.poster})`}}>

    <div className='movieDetails'>
        <h2><b>{title}</b></h2>
        <h3><b>{year}</b></h3>
        <button id='movieCardButton'>Add to list</button>
    </div>


    </div>
  )
}

export default MovieCard