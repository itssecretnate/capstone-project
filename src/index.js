import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import {BrowserRouter, Routes, Route, Outlet} from 'react-router-dom'
import { CookiesProvider } from "react-cookie";

// Page imports.
import App from './App';
import SearchMovie from './Pages/SearchMovie';
import Home from './Pages/Home';
import Watchlist from './Pages/Watchlist';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CookiesProvider>
  <React.StrictMode>
        <BrowserRouter>
      <Routes>

        {/* Default landing. AKA Page not found. */}
        <Route path="*" element={<div><h1>Page not found.</h1></div>} />
        
          {/* Default App / Nav Bar. */}
          <Route path='' element={<App />}>

          {/* HomePage */}
          <Route index element={<Home />} />


          {/* Products Page */}
          <Route path='search'>
            <Route index element={<SearchMovie />} />
            {/* <Route path='product/:id' element={<Details />} /> */}
          </Route>

          <Route path='watchlist' element={<Watchlist />} />

          </Route>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
  </CookiesProvider>
);
