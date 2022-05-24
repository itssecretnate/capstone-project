import React from 'react'

import MovieCard from './MovieCard';

function PosterDisplay(props) {

    const {movies, isInWatchList, getAllMovies} = props;

  return (
    <div className='resultsContainer'>
        {movies && movies.map(movie => <MovieCard key={movie.imdb_id} movie={movie} watchListItem={isInWatchList(movie.imdb_id)} updateList={getAllMovies}/>)}
    </div>
  )
}

export default PosterDisplay