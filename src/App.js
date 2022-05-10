// Import modules
import axios from 'axios'

import logo from './logo.svg';
import './App.css';

// Import Components:
import MovieCard from './Components/MovieCard';
import SearchMovie from './Pages/SearchMovie';


const API_BASE_URL = 'http://www.omdbapi.com/'

function App() {
  return (
    <div className="App">
      <SearchMovie apiURL={API_BASE_URL}/>
    </div>
  );
}

export default App;
