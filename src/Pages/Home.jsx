import React, {useState, useEffect} from 'react'
import axios from 'axios'

import MovieCard from '../Components/MovieCard'

function Home() {

    const [movies, setMovies] = useState([]);

    useEffect(() => {
            axios.get('/api/watchlist')
            .then(res => {
                console.log(res.data);
                setMovies(res.data);
            })
    }, [])

    const randNum = (range, prevArr) => {
        let num = Math.round(Math.random() * range);

        // This checks an array that's passed through that includes numbers already used to prevent duplicates.
        if(prevArr !== undefined && prevArr.includes(num)) {
            return randNum(range, prevArr);
        }

        return num;
    }

    const displayMovies = (count) => {

        if(!Array.isArray(movies)) return(<h1>Error retrieving movies.</h1>);

        let moviesArr = [];
        let newCount = count > movies.count ? movies.count : count;

        let filteredMovies = movies.filter(movie => movie.release_date === null)

        for(let i = 0; i < newCount; i++) {
            moviesArr.push( <MovieCard movie={filteredMovies[i]} previewOnly={'true'} />)
        }
        return moviesArr;
    }

    const displayRandomMovies = (count) => {

        if(!Array.isArray(movies)) return(<h1>Error retrieving movies.</h1>);


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

        if(!Array.isArray(movies)) return(<h1>Error filtering movies.</h1>);


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