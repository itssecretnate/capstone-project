import React, {useState} from 'react'
import axios from 'axios'

import config from '../config'

import MovieCard from '../Components/MovieCard';

function SearchMovie(props) {

    const API_BASE_URL = props.apiURL;
    const API_KEY = config.API_KEY // TODO: Move this file somewhere else.

    const [title, setTitle] = useState('');;
    const [year, setYear] = useState('');
    const [movies, setMovies] = useState([]);

    const searchResults = async (e) => {
        e.preventDefault();
        const searchRes = await axios.get(`${API_BASE_URL}?${API_KEY}&s=${title}&y=${year}`)
        // console.log(searchRes.data.Search);
        setMovies(searchRes.data.Search);
    }

    return (
        <div><h1>SearchMovie</h1>
            <form onSubmit={searchResults}>
                <label>Title: <input type='text' onChange={e => setTitle(e.target.value)}></input></label>
                <label>Year: <input type='text' onChange={e => setYear(e.target.value)}></input></label>
                <button>Search</button>
            </form>

            <h2>Search Results:</h2>
            <div className='resultsContainer'>
                {movies && movies.map(movie => <MovieCard key={movie.imdbID} movie={movie} />)}
            </div>

        </div>
    )
}

export default SearchMovie