drop table if exists movie_watchlist;
drop table if exists movie_ratings;
drop table if exists movies;
drop table if exists authentication;
drop table if exists users;


CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    username VARCHAR(16) NOT NULL UNIQUE,
    is_admin BOOLEAN NOT NULL,
    creation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP with TIME ZONE
);

  CREATE TABLE authentication (
    authentication_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    -- Relase year may contain 2 years for when a series started and ended.
    poster TEXT,
    release_year VARCHAR(15),
    plot TEXT
);

CREATE TABLE movie_ratings (
    rating_id SERIAL PRIMARY KEY,
    rating FLOAT(10) NOT NULL,
    movie_id INTEGER NOT NULL REFERENCES movies(movie_id),
    user_id INTEGER NOT NULL REFERENCES users(user_id)
);

CREATE TABLE movie_watchlist (
    watchlist_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    -- Rating ID? May need to figure out how to calculate movie ratings.
    movie_id INTEGER NOT NULL REFERENCES movies(movie_id),
    -- May not need the is_watched. Just cacluate with a watch_date?
    is_watched BOOLEAN NOT NULL DEFAULT false,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    watch_date TIMESTAMP
);



-- Seeding DB

INSERT INTO movies(title, poster, release_year, plot)
VALUES
('Test Movie 1', 'https://via.placeholder.com/540x800?text=Test+Movie+1', 2022, NULL),
('Test Movie 2', 'https://via.placeholder.com/540x800?text=Test+Movie+2', 1999, NULL),
('Test Movie 3', 'https://via.placeholder.com/540x800?text=Test+Movie+3', '0 AD', NULL);


INSERT INTO users(creation_date, is_admin, username, first_name, last_name)
VALUES
(NOW(), FALSE, 'DemoUser1', 'Jane', 'Doe'),
(NOW(), FALSE, 'DemoUser2', 'John', 'Smith');

-- Movie Rating
INSERT INTO movie_ratings(rating, movie_id, user_id)
VALUES
(7, 1, 1),
(6.5, 1, 2),
(5, 2, 1),
(1, 2, 2),
(9.5, 3, 1),
(8.5, 3, 2);

-- Watch List
INSERT INTO movie_watchlist(user_id, movie_id, date_added)
VALUES
(1, 1, NOW()),
(1, 3, NOW()),
(2, 3, NOW()),
(2, 2, NOW());



-- Queries

-- Get average rating of movies.
SELECT m.title, AVG(mr.rating)
FROM movie_ratings as mr
LEFT OUTER JOIN movies m 
ON mr.movie_id = m.movie_id
GROUP BY m.title;

-- Seeing details about who rated what movie
SELECT m.title, mr.rating, u.username
FROM movie_ratings as mr
LEFT OUTER JOIN movies m 
ON mr.movie_id = m.movie_id
LEFT OUTER JOIN users u
ON mr.user_id = u.user_id
ORDER BY u.username ASC;

-- Get all watchlisted movies
SELECT m.title, u.username, date_added FROM movie_watchlist as wl
LEFT OUTER JOIN movies m
ON wl.movie_id = m.movie_id
LEFT OUTER JOIN users u
ON wl.user_id = u.user_id
ORDER BY u.username ASC;
