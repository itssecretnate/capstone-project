import React, {useState, useEffect} from 'react'
import axios from 'axios'

import PosterDisplay from '../Components/PosterDisplay';

function Watchlist(props) {

    const [movies, setMovies] = useState([]);
    const [watchList, setWatchlist] = useState();

    useEffect(() => {
        getWatchlist();
        getAllMovies(); // Move this to useEffect.
    }, [])

    const isInWatchList = (movieTitle) => {
        if(watchList) {
            for(let i in watchList) {
                if(watchList[i].imdb_id === movieTitle) return true;
            }
        }
        return false;
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
        <div className='searchDiv'>
            <PosterDisplay movies={movies.sort()} isInWatchList={isInWatchList} getAllMovies={getAllMovies} />
        </div>
    )
}

export default Watchlist