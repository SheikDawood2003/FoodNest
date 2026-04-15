import React from 'react';
import Menubar from './components/Menubar/Menubar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import ExploreFood from './pages/ExploreFood/ExploreFood';
import Contactus from './pages/Contact Us/Contactus';
import FoodDetails from './pages/FoodDetails/FoodDetails';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import { ToastContainer } from 'react-toastify';
import Myorders from './pages/MyOrders/Myorders';
import { useContext } from 'react';
import { StoreContext } from './context/StoreContext';


function App() {

  const {token} = useContext(StoreContext);
  return (
    <div>
      <Menubar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExploreFood />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/placeorder" element={token ? <PlaceOrder /> : <Login />} />
        <Route path='/login' element={token ? <Home /> :<Login />} />
        <Route path='/register' element={token ? <Home /> :<Register />} />
        <Route path='/myorders' element={token ? <Myorders /> : <Login />} />
      </Routes>
    </div>
  )
}


export default App;
