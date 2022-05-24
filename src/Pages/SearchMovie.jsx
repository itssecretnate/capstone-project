import React, {useState, useEffect} from 'react'
import axios from 'axios'

import PosterDisplay from '../Components/PosterDisplay';

function SearchMovie(props) {

    const [title, setTitle] = useState('');;
    const [year, setYear] = useState('');
    const [movies, setMovies] = useState([]);

    const [watchList, setWatchlist] = useState();

    useEffect(() => {
        getWatchlist(); // Move this to useEffect.
    }, [movies])

    const isInWatchList = (movieTitle) => {
        if(watchList) {
            for(let i in watchList) {
                if(watchList[i].imdb_id === movieTitle) return true;
            }
        }
        return false;
    }

    const searchResults = async (e) => {
        e.preventDefault();
        
        axios.get(`http://localhost:9001/movies`, {params: {title: title, year: year}})
        .then( res => {
            let filteredMovies = res.data.filter(movie => !isInWatchList(movie.imdb_id))
            setMovies(filteredMovies);
        })
    }
    
    const getWatchlist = async (e) => {
        if(e) e.preventDefault();
        
        axios.get(`http://localhost:9001/watchlist`).then(res => {
            res.data.forEach((movie, index) => {
                movie.onWatchlist = true;
                res.data[index] = movie;
            })
            console.log('Watchlist downloaded.')
            setWatchlist(res.data);
            }
        )
    }

    const getAllMovies = async (e) => {
        if(e) e.preventDefault();

        setMovies([]);

        axios.get('http://localhost:9001/movies', {params: {watchlist: true}})
        .then(res => {
            setMovies(res.data);
        })
    }

    return (
        <div className='searchDiv'><h1>SearchMovie</h1>
            <form onSubmit={searchResults}>
                <label>Title: <input type='text' onChange={e => setTitle(e.target.value)}></input></label>
                <label> Year: <input type='text' onChange={e => setYear(e.target.value)}></input></label>
                <button>Search</button>
            </form>

            {/* <button onClick={getAllMovies}>Show Watchlist</button> */}

            <h2>Search Results:</h2>
            <PosterDisplay movies={movies} isInWatchList={isInWatchList} getAllMovies={getAllMovies} />

            {/* <div className='resultsContainer'>
                {movies && movies.map(movie => <MovieCard key={movie.imdb_id} movie={movie} watchListItem={isInWatchList(movie.title)} updateList={getAllMovies}/>)}
            </div> */}

        </div>
    )
}

export default SearchMovie