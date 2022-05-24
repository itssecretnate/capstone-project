import React from 'react'
import {Outlet, Link} from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
        <h1 className="navBarLogo">Movie Nite</h1>
        <div className="navPageOptions">
            <Link className='navLink' to='/'>Home</Link>
            <Link className='navLink' to='search'>Search</Link>
            <Link className='navLink' to='watchlist'>Watchlist</Link>
        </div>
            <div className='profilePicture'><p>NM</p></div>
    </nav>
  )
}

export default Navbar