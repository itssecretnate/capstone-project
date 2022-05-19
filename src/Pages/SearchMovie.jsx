import React, {useState, useEffect} from 'react'
import axios from 'axios'

import config from '../config'

import MovieCard from '../Components/MovieCard';

function SearchMovie(props) {

    const API_BASE_URL = props.apiURL;
    const API_KEY = config.API_KEY;

    const [title, setTitle] = useState('');;
    const [year, setYear] = useState('');
    const [movies, setMovies] = useState([]);

    // Debugging watchlist
    const [username, setUsername] = useState('');

    const searchResults = async (e) => {
        e.preventDefault();

        let fixedMovieArr = []; // No further questions at this time. Need to see if there's a better way to remap the variables.
        
        axios.get(`${API_BASE_URL}?&apikey=${API_KEY}&s=${title}&y=${year}`)
        .then( searchRes => {
                searchRes.data.Search.forEach(movie => {
                    const {Title: title, Poster: poster, Year: year} = movie;
                    fixedMovieArr.push({title, poster, year})
                })
                setMovies(fixedMovieArr);
            })
        
    }

    const getWatchlist = async (e) => {
        e.preventDefault();

        axios.put(`http://localhost:9001/watchlist`, {username}).then(res => {
            setMovies(res.data)
            }
        )
    }

    return (
        <div><h1>SearchMovie</h1>
            <form onSubmit={searchResults}>
                <label>Title: <input type='text' onChange={e => setTitle(e.target.value)}></input></label>
                <label> Year: <input type='text' onChange={e => setYear(e.target.value)}></input></label>
                <button>Search</button>
            </form>

            <form onSubmit={getWatchlist}>
                <label>Username: </label>
                    <input type='text' onChange={e => setUsername(e.target.value)}/>
                <button>Get Watchlist</button>
            </form>

            <h2>Search Results:</h2>
            <div className='resultsContainer'>
                {movies && movies.map(movie => <MovieCard movie={movie} />)}
            </div>

        </div>
    )
}

export default SearchMovie