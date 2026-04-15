import React from 'react';
import { Link } from 'react-router-dom';
import {assets} from './../../assets/assest'

function Sidebar({ sidebarVisible }) {
  return (
    <div>
        <div className={"border-end bg-white" + (sidebarVisible ? "" : " d-none")} id="sidebar-wrapper">
            <div className="sidebar-heading border-bottom bg-light">
                <img src={assets.logo} alt="Logo" height={35} width={35} />
            </div>
            <div className="list-group list-group-flush">
                <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/addfood">
                    <i className="bi bi-plus-circle me-2"></i> Add Foods
                </Link>
                <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/listfood">
                    <i className="bi bi-list me-2"></i> List of Foods
                </Link>
                <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/orders">
                    <i className="bi bi-cart me-2"></i> Orders
                </Link>
            </div>
        </div>
    </div>
  )
}


export default Sidebar;
