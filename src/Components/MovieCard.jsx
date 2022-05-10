import React from 'react'

function MovieCard(props) {
    
    const testData = {
        title: 'Untitled',
        poster: 'https://via.placeholder.com/720x1080?text=No+Poster',
        year: '2022'
    }

    const {Title: title, Poster: poster, Year: year} = props.movie !== undefined ? props.movie : testData;   


  return (
    <div className='movieCard'>
        <p>{title}</p>
        <p>{year}</p>
        <img src={poster !== 'N/A' ? poster : testData.poster} />
    </div>
  )
}

export default MovieCard