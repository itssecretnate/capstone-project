import React, {useState, useEffect} from 'react'
import axios from 'axios'

import MovieCard from '../Components/MovieCard'

function Home() {

    const [movies, setMovies] = useState([]);

    useEffect(() => {
            axios.get('http://localhost:9001/watchlist')
            .then(res => {
                setMovies(res.data);
            })
    }, [])

    const randNum = (range, prevArr) => {

        let num = Math.round(Math.random() * range);

        if(prevArr !== undefined && prevArr.includes(num)) {
            return randNum(range, prevArr);
        }
        
        return num;
    }

    const displayMovies = (count) => {
        let moviesArr = [];
        let newCount = count > movies.count ? movies.count : count;

        let filteredMovies = movies.filter(movie => movie.release_date === null)

        for(let i = 0; i < newCount; i++) {
            moviesArr.push( <MovieCard movie={filteredMovies[i]} previewOnly={'true'} />)
        }
        return moviesArr;
    }

    const displayRandomMovies = (count) => {
        let moviesArr = [];
        let previousRand = [];

        let newCount = count > movies.count ? movies.count : count;

        let filteredMovies = movies.filter(movie => movie.release_date === null && movie.date_watched === null)

        for(let i = 0; i < newCount; i++) {

            let index = randNum(filteredMovies.length-1, previousRand);
            if(index < 0) index = 0;
            previousRand.push(index);

            moviesArr.push( <MovieCard movie={filteredMovies[index]} previewOnly={'true'} />)
        }
        return moviesArr;
    }

    const displayUpcoming = (count) => {
        let moviesArr = [];
        let newCount = count > movies.count ? movies.count : count;

        let filteredMovies = movies.filter(movie => movie.release_date !== null)

        for(let i = 0; i < newCount; i++) {

            moviesArr.push( <MovieCard movie={filteredMovies[i]} previewOnly={'true'} />)
        }
        return moviesArr;
    }

    return (
        <div>
            <div className='posterSection'>
                <h1>Upcoming Movies:</h1>
                <div id='movieCardSection'>
                    {displayUpcoming(3)}
                </div>
            </div>
            <div className='posterSection'>
                <h1>Random Watchlist Recommendations:</h1>
                <div id='movieCardSection'>
                    {displayRandomMovies(5)}
                </div>
            </div>
            <div className='posterSection'>
                <h1>Recently Added to List:</h1>
                <div id='movieCardSection'>
                    {displayMovies(5)}
                </div>
            </div>
        </div>
    )
}

export default Home