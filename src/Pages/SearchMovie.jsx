import React, {useState, useEffect} from 'react'
import axios from 'axios'

import PosterDisplay from '../Components/PosterDisplay';

function SearchMovie(props) {

    const [title, setTitle] = useState('');;
    const [year, setYear] = useState('');
    const [movies, setMovies] = useState([]);

    const [watchList, setWatchlist] = useState();

    useEffect(() => {
        getWatchlist();
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
        
        axios.get('/api/movies', {params: {title: title, year: year}})
        .then( res => {

            if(!Array.isArray(res.data)) return (<h1>Error retrieving movies.</h1>)

            let filteredMovies = res.data.filter(movie => !isInWatchList(movie.imdb_id))
            setMovies(filteredMovies);
        })
    }
    
    const getWatchlist = async (e) => {
        if(e) e.preventDefault();
        
        axios.get('/api/watchlist').then(res => {
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

        axios.get('movies', {params: {watchlist: true}})
        .then(res => {
            setMovies(res.data);
        })
    }

    return (
        <div className='searchDiv'>
            <form className='searchForm' onSubmit={searchResults}>
                <label>Title: <input type='text' onChange={e => setTitle(e.target.value)}></input></label>
                <label> Year: <input type='text' onChange={e => setYear(e.target.value)}></input></label>
                <button>Search</button>
            </form>

            <PosterDisplay movies={Array.isArray(movies) && movies} isInWatchList={isInWatchList} getAllMovies={getAllMovies} />
        </div>
    )
}

export default SearchMovie