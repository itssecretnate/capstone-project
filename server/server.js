require('dotenv').config({ path: `${__dirname}/../.env` })
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path');

// const {seed} = require('./seedDB.js');
const {login, register, getWatchlist} = require('./controller.js');

app.use(express.json())
app.use(cors())

// Middleware setup (Send HTML to page)

const publicfolder = path.join(__dirname, '../build/')

// app.use(express.static(publicfolder));

// app.get('/', (req, res) => { res.sendFile(publicfolder + 'index.html')
// })

// Endpoints
// app.post('/api/seed', seed);

app.post('/register', register);
app.post('/login', login);


app.put('/watchlist', getWatchlist);


const SERVER_PORT = process.SERVER_PORT || 9001;
app.listen(SERVER_PORT, () => console.log(`Server running on: ${SERVER_PORT}`))