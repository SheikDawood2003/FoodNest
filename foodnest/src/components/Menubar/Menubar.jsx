import React from 'react';
import './Menubar.css';
import { Images } from './../../assets/Images/assets';
import {Link, useNavigate, NavLink} from 'react-router-dom';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';

function Menubar() {


    const {quantity, token, setToken, setQuantity} = useContext(StoreContext);
    const cartItemCount = Object.values(quantity).filter(qty => qty > 0).length;

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        setToken("");
        setQuantity({});
        navigate("/");
    }
  return (
    <div>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">
                <a className="navbar-brand" href="#">
                    <img src={Images.logo} alt="Logo" width="50" height="50" className='logo' />
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link fw-bold active' : 'nav-link'}>
                            Home
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/explore" className={({ isActive }) => isActive ? 'nav-link fw-bold active' : 'nav-link'}>
                            Explore
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/contactus" className={({ isActive }) => isActive ? 'nav-link fw-bold active' : 'nav-link'}>
                            Contact Us
                        </NavLink>
                    </li>
                </ul>
                <div className="menubar-right">
                    <Link to={'/cart'}>
                        <div className="position-relative">
                            <img src={Images.cart} alt="Cart" height={30} width={36} className='positon-relative' />
                            <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning'>{cartItemCount}</span>
                        </div>
                    </Link>
                {
                    !token ? 
                    <>
                        <button className='btn btn-outline-primary btn-sm' onClick={() => navigate("/login")}>Login</button>
                        <button className='btn btn-outline-success btn-sm' onClick={() => navigate("/register")}>Register</button>
                    </>
                    :
                    <div className='dropdown text-end'>
                        <Link href="" className='d-block link-body-emphasis text-decoration-none dropdown-toggle' data-bs-toggle="dropdown" aria-expanded='false'>
                            <img src={Images.login} alt="" width={32} height={32} className='rounded-circle'/>
                        </Link>
                        <ul className='dropdown-menu text-small'>
                            <li className='dropdown-item' onClick={() => navigate("/myorders")} >Orders</li>
                            <li className='dropdown-item' onClick={logout} >Logout</li>
                        </ul>
                    </div>
                }
                </div>
                </div>
            </div>
        </nav>
    </div>
  )
}

export default Menubar;