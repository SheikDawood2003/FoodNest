import React from 'react'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import ListFoods from './pages/ListFoods/ListFoods'
import Addfood from './pages/AddFood/AddFoods'
import Orders from './pages/Orders/Orders'
import Sidebar from './components/Sidebar/Sidebar'
import Menubar from './components/Menubar/Menubar'
import { ToastContainer } from 'react-toastify';


function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="d-flex" id="wrapper">
            {/* <!-- Sidebar--> */}
            <Sidebar sidebarVisible={sidebarVisible}/>
            {/* <!-- Page content wrapper--> */}
            <div id="page-content-wrapper">
                {/* <!-- Top navigation--> */}
                <Menubar toggleSidebar={toggleSidebar} />
                <ToastContainer />
                {/* <!-- Page content--> */}
                <div className="container-fluid">
                    <Routes>
                      <Route path='/addfood' element={<Addfood />} />
                      <Route path='/listfood' element={<ListFoods />} />
                      <Route path='/orders' element={<Orders />} />
                      <Route path='/' element={<ListFoods />} />
                    </Routes>
                </div>
            </div>
        </div>
  )
}


export default App
