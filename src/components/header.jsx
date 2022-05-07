import React from 'react';
import Login from './login'

export const Header = () => {
  return (
    <nav id='navigation'>
      <h1 href='#' className='logo'>
        eth-hub
      </h1>
      <button>
        <Login />
      </button>
    </nav>
  );
};

export default Header;
