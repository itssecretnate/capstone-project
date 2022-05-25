// Import modules
import axios from 'axios'
import {Outlet} from 'react-router-dom'

// Other imports
import './App.css';
import Navbar from './Components/Navbar';


function App() {
    
    return (
      <>
    <Navbar />
    <Outlet />
    </>
  )
}

export default App;
