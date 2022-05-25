import React, {useState} from 'react'

import {Link} from 'react-router-dom'
import { useCookies } from 'react-cookie';

import AccountPopup from '../Components/AccountPopup';

function Navbar() {

  const [cookies] = useCookies(["username"]);

  const [displayLogin, setDisplayLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(cookies.username);


  // <button onClick={CreateCookie}>Create Cookie</button> 
  // <p>Show cookie : </p>{cookies.username && <p>{cookies.username}</p>}

  return (
    <>
    <nav className="navbar">
        <h1 className="navBarLogo">Movie Nite</h1>
        <div className="navPageOptions">
            <Link className='navLink' to=''>Home</Link>
            <Link className='navLink' to='search'>Search</Link>
            <Link className='navLink' to='watchlist'>Watchlist</Link>
        </div>
        { isLoggedIn && 
          <div>
            <p id='demoUserName'>Welcome: {cookies.username}</p>
            <div className='profilePicture'><p>{cookies.username[0]}</p></div> 
          </div>
        }
        { !isLoggedIn && <h2 className='headerLoginButton' onClick={e => setDisplayLogin(!displayLogin)}>Login</h2>}
    </nav>

    <AccountPopup display={displayLogin} setLoggedIn={setIsLoggedIn}/>

    </>
  )
}

export default Navbar