import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <div className='p-5 md-4 bg-light rounded-3 mt-1 header'>
        <div className='container-fluid py-5'>
            <h1 className='display-5 fw-bold'>Order your favorite food</h1>
            <p className='col-md-8 fs-4'>Discover the best food and drinks in your area</p>
            <NavLink 
              to="/explore" 
              className={({ isActive }) => isActive ? 'btn btn-primary active' : 'btn btn-primary'}>
              Explore
          </NavLink>
        </div>
    </div>
  )
}

export default Header;