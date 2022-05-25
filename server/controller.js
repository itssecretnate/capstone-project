const Sequelize = require('sequelize');
const bcryptjs = require("bcryptjs");
const axios = require('axios');

const {MOVIE_API_URL, MOVIE_API_KEY} = process.env;

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

// FIGURE OUT HOW TO IMPORT UTILS FILE THAT CONTAINS THIS CODE.
const posterFix = (url, size = '800') => {
    return url.replace('SX300', `SX${size}`);
}

const formatMovie = (movie) => {

    // Deconstruct the movie and remap to the variable names we need.
    const {Title: title, Poster: poster, Year: release_year, imdbID: imdb_id} = movie;

    // Hack-y way to set the posted to placeholder data until. TODO: Look for more elegant way of doing this. (Maybe handle this client-side)
    let fixedPoster = '';
    poster !== undefined && (fixedPoster = posterFix(poster))
    poster == 'N/A' && (fixedPoster = 'https://via.placeholder.com/540x800?text=Missing+Poster');

    return({title, poster: fixedPoster, release_year, imdb_id})

}

module.exports = {

    login: (req, res) => {
        const { username, password } = req.body;

        // if(!validateBody(req.body)) {
        //     res.sendStatus(400);
        //     return;
        // }

        if(!(username && password)) {
            res.sendStatus(400);
            return;
        }

        sequelize.query(`

        SELECT u.username, a.password, a.user_id 
        FROM authentication AS a
        LEFT OUTER JOIN users u
        ON u.user_id = a.user_id
        WHERE LOWER(u.username) = LOWER('${username}');
        `)
        
        .then(dbRes => {
            
            try {
                const {username: dbUsername, password: dbPassword, user_id: userID} = dbRes[0][0];

                if(bcryptjs.compareSync(password, dbPassword)) {
                    console.log(`${dbUsername} authenticated.`);
                    sequelize.query(`
                    UPDATE users
                    SET last_login = NOW()
                    WHERE username = '${username}';
                    `)
                    res.status(200).send({username, userID});
                }
                else {
                    res.status(400).send('Passwords do not match.')
                }
            }
            catch {
                res.sendStatus(400);
                console.log('Error with login. dbRes may be empty. (Does the username exist in db?');
            }
        })
        
        .catch(err => {
            let error = err.message;
            res.status(400).send(error);
            console.log(error);
        })
      },
  
      register: (req, res) => {
        try {
        const { firstName, lastName, email, username, password } = req.body;

        let isAdmin = false; // TODO

        // TODO: Valid body check

        let hashSalt = bcryptjs.genSaltSync(5);
        let hashPassword = bcryptjs.hashSync(password, hashSalt);

        sequelize.query(`
        WITH new_user AS (
        INSERT INTO users(first_name, last_name, username, creation_date, is_admin)
        VALUES('${firstName}', '${lastName}', '${username}', NOW(), ${isAdmin})
        RETURNING user_id)
            
        INSERT INTO authentication(user_id, email, password)
        SELECT user_id, '${email}', '${hashPassword}' FROM new_user;
        `)

        .then(dbRes => {
            res.status(200).send('User registered succesfully!')
        })

        .catch(err => {
            let error = err;
            res.status(400).send(error);
            console.log(error);
        })}
        catch {
            res.sendStatus(500);
        }
      },

      getWatchlist: (req, res) => {
        try {
            sequelize.query(`SELECT * FROM movies
            ORDER BY date_added DESC;`)
            .then(dbRes => {
                res.status(200).send(dbRes[0]);
            })
        }
        catch(err) { console.log(err); }
      },

      addToMovieTable: (req, res) => {
          
          try { 
            const {title, poster, year, release_date, imdb_id} = req.body;

            sequelize.query(`
            INSERT INTO movies(title, poster, release_year, release_date, imdb_id)
            VALUES('${title}', 
            ${poster ? `'${poster}'` : 'NULL'}, 
            '${year}', 
            ${release_date !== undefined ? release_date : 'NULL'}, 
            '${imdb_id !== undefined || imdb_id === '' ? imdb_id : 'NULL'}')
            RETURNING movie_id;
            `)
            .then(dbRes => { 
                const {movie_id} = dbRes[0][0];
                res.status(200).send(`${title} has been added to movie DB. Movie_ID: ${movie_id}`)
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
        }

        catch(err) {
            console.log(err);
            res.sendStatus(400);
        }
      },

      addToWatchlist: (req, res) => {
        res.sendStatus(501); // 501 = Not implemented
      },

      getMovies: (req, res) => {

        try {
        const {title, year, watchlist} = req.query;
            

        if(!title && !watchlist) {
            res.sendStatus(400);
            return;
        }

            if(watchlist === 'true') {
                sequelize.query(`SELECT * FROM movies
                ORDER BY release_date asc, date_watched desc, title asc;`)
                .then(dbRes => {
                    res.status(200).send(dbRes[0]);
                })
                return;
            }

            axios.get(`${MOVIE_API_URL}?&apikey=${MOVIE_API_KEY}&s=${title}&y=${year}`)
            .then(dbRes => {
                const movies = dbRes.data.Search;

                if(!Array.isArray(movies)) {
                    // TODO: Implement better error handling for when results are not found. { Response: 'False', Error: 'Movie not found!' }
                    if(dbRes.data.Response === 'False') {
                        console.log("Search result not found.");
                        res.sendStatus(501);
                        return;
                    }
                    console.log(dbRes.data);
                    res.status(200).send(formatMovie(movies));
                    return;
                }

                let fixedMovieArr = [];

                movies.forEach(movie => {
                    fixedMovieArr.push(formatMovie(movie));
                })

                res.status(200).send(fixedMovieArr);
                return;
            })

          }
          catch {
              res.sendStatus(400);
          }
      },

      watchedMovie: (req, res) => {
          const {movie_id} = req.body;

          sequelize.query(`
          UPDATE movies
          SET date_watched = NOW()
          WHERE movie_id = ${movie_id};
          `)
          .then(res.sendStatus(200))
      },

      removeFromWatchlist: (req, res) => {
          const {title} = req.body;
          
          try {
              sequelize.query(`
              DELETE FROM movies
              WHERE title = '${title}';
              `)
              .then(dbRes => {
                  res.status(200).send(dbRes[0]);
              })
              .catch(err => {
                  res.sendStatus(400);
              })
            }

          catch {
              res.sendStatus(400);
          }
        },

        updateWatchList: (req, res) => {
            const {title} = req.body;

            if(title === undefined) {
                res.sendStatus(400);
                return;
            }

            sequelize.query(`
            UPDATE movies
            SET date_watched = NOW()
            WHERE title = '${title}'
            RETURNING date_watched;
            `)
            .then(dbRes => {
                res.status(200).send(dbRes[0][0]);
            })
        }
}

