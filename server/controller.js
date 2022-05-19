const Sequelize = require('sequelize');
const bcryptjs = require("bcryptjs");

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

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
            // let error = err.errors[0].message;
            let error = err;
            res.status(400).send(error);
            console.log(error);
        })
      },

      getWatchlist: (req, res) => {
          const {username} = req.body;

          console.log(username);

          if(username === undefined) {
              res.status(200).send('Undefined username.');
              return;
          }

          sequelize.query(`
            SELECT m.title, m.poster, m.release_year AS year, date_added FROM movie_watchlist as wl
            LEFT OUTER JOIN movies m
            ON wl.movie_id = m.movie_id
            LEFT OUTER JOIN users u
            ON wl.user_id = u.user_id
            WHERE LOWER(u.username) = LOWER('${username}');
          `).then(
              dbRes => {
                res.status(200).send(dbRes[0]);
              }
          )
      }
}