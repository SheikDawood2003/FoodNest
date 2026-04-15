import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import {Images} from '../../assets/Images/assets';
import { StoreContext } from '../../context/StoreContext';
import { calculateCartTotal } from '../../util/Cartutil';
import axios from 'axios';
import { toast } from 'react-toastify';
import {key} from './../../util/Constants';
import { useNavigate } from 'react-router-dom';
// import {Razorpay} from 'razorpay';

function PlaceOrder() {

    const {foodList, quantity, setQuantity, token} = useContext(StoreContext);
    const navigate = useNavigate();

    const [data, setData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      state: '',
      city: '',
      zip:''
    });

    const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;

      setData( data => ({...data, [name]: value}));
    };

    const onSubmitHandler = async (event) => {
      event.preventDefault();
      const orderData = {
        userAddress: `${data.firstName} ${data.lastName} ${data.address}, ${data.city} ${data.state} ${data.zip}`,
        phoneNumber: data.phoneNumber,
        email: data.email,
        orderItemList: cartItem.map(item => ({
          foodId: item.foodId,
          quantity: quantity[item.id],
          price: item.price * quantity[item.id],
          category: item.category,
          imageUrl : item.imageUrl,
          description : item.description,
          name : item.name
        })),
        amount: parseFloat(total.toFixed(2)),
        orderStatus: "Preparing"
      };

      try {
        const response = await axios.post("http://localhost:8080/api/orders/create", orderData, {headers: {'Authorization' : `Bearer ${token}`}});
        if(response.status === 201 && response.data.razorpayOrderId){
          initiateRazorpayPayment(response.data);
        }
        else{
          toast.error("Unable to place order. please try again.");
        }
      } catch (error) {
        console.log(error);
        toast.error("Unable to place order. please try again.");
        
      }
      
    }

    const initiateRazorpayPayment = (order) => {
      const options = {
        key: key,
        amount: order.amount * 100, // IMPORTANT FIX
        currency: "INR",
        name: "Food Nest",
        description: "Food Order Payment",
        order_id: order.razorpayOrderId,

        handler: function (response) {
          verifyPayment(response);
        },

        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phoneNumber
        },

        theme: { color: "#3399cc" },

        modal: {
          ondismiss: async function () {
            toast.error("Payment Cancelled");
            await deleteOrder(order.id);
          }
        }
      };

      const razorPay = new window.Razorpay(options);
      razorPay.open();
    };

    const verifyPayment = async (razorpayResponse) => {
      console.log("RAZORPAY RESPONSE:", razorpayResponse);

      const paymentData = {
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_signature: razorpayResponse.razorpay_signature
      };

      try {
        const response = await axios.post(
          "http://localhost:8080/api/orders/verify",
          paymentData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("VERIFY RESPONSE:", response);

        toast.success("Payment Successful");
        await clearCart();
        navigate("/myorders");

      } catch (error) {
        console.log("VERIFY ERROR:", error.response?.data || error.message);
        toast.error("Payment Failed");
      }
    };

    const deleteOrder = async(orderId) => {
      try {
        await axios.delete("http://localhost:8080/api/orders/"+ orderId, {headers: {'Authorization' : `Bearer ${token}`}});
      } catch (error) {
        console.log(error);
        toast.error("Somethink went Worng");
      }
    }

    const clearCart = async () => {
      try {
        await axios.delete("http://localhost:8080/api/cart/delete", {headers: {'Authorization' : `Bearer ${token}`}});
        setQuantity({});
      } catch (error) {
        console.log(error);
        toast.error("Error While clear the cart");
      }
    }

    const cartItem = foodList.filter(food => quantity[food.id] > 0);

    const { subTotal, shipping, tax, total } = calculateCartTotal(cartItem, quantity);


  return (
    <div>

      <div className="container mt-3">
        <main>
            <div className="py-5 text-center">

                <img
                    className="d-block mx-auto"
                    src={Images.logo}
                    alt=""
                    width="98"
                    height="98"
                />
            </div>
          <div className="row g-5">

            <div className="col-md-5 col-lg-4 order-md-last">

              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-primary">Your cart</span>
                <span className="badge bg-primary rounded-pill">{cartItem.length}</span>
              </h4>

              <ul className="list-group mb-3">

                {
                    cartItem.map(item =>(
                        <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                                <h6 className="my-0">{item.name}</h6>
                                <small className="text-body-secondary">
                                    Qty :{quantity[item.id]}
                                </small>
                            </div>
                            <span className="text-body-secondary">₹{item.price * quantity[item.id]}</span>
                        </li>
                    ))
                }

                <li className="list-group-item d-flex justify-content-between">
                  <div>
                    <span>
                        Shipping
                    </span>
                  </div>
                  <span className="text-body-secondary">₹{subTotal === 0 ? 0.0 : shipping.toFixed(2)}</span>
                </li>

                <li className="list-group-item d-flex justify-content-between">
                  <div>
                    <span>Tax (10%)</span>
                  </div>
                  <span className="text-body-secondary">₹{tax.toFixed(2)}</span>
                </li>

                <li className="list-group-item d-flex justify-content-between">
                  <span>Total (INR)</span>
                  <strong>₹{total.toFixed(2)}</strong>
                </li>

              </ul>

            </div>

            <div className="col-md-7 col-lg-8">

              <h4 className="mb-3">Billing address</h4>

              <form className="needs-validation" onSubmit={onSubmitHandler}>

                <div className="row g-3">

                  <div className="col-sm-6">
                    <label htmlFor="firstName" className="form-label">First name</label>
                    <input type="text" className="form-control" id="firstName" placeholder='First Name' required name='firstName' value={data.firstName} onChange={onChangeHandler} />
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="lastName" className="form-label">Last name</label>
                    <input type="text" className="form-control" id="lastName" placeholder='Last Name' required name='lastName' value={data.lastName} onChange={onChangeHandler} />
                  </div>

                  <div className="col-12">
                    <label htmlFor="username" className="form-label">Email</label>
                    <div className="input-group has-validation">
                      <span className="input-group-text">@</span>
                      <input type="email" className="form-control" id="email" placeholder="Email" required name='email' value={data.email} onChange={onChangeHandler}/>
                    </div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="phonenumber" className="form-label">Phone Number</label>
                    <input type="number" className="form-control" id="phonenumber" placeholder="1234567890" required name='phoneNumber' value={data.phoneNumber} onChange={onChangeHandler} />
                  </div>

                  <div className="col-12">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" placeholder="1234 Main St" required name='address' value={data.address} onChange={onChangeHandler} />
                  </div>


                  <div className="col-md-4">
                    <label htmlFor="state" className="form-label">State</label>
                    <select className="form-select" id="state" required name='state' value={data.state} onChange={onChangeHandler}>
                      <option value="">Choose...</option>
                      <option>Tamil Nadu</option>
                    </select>
                  </div>

                  <div className="col-md-5">
                    <label htmlFor="city" className="form-label">City</label>
                    <select className="form-select" id="city" required name='city' value={data.city} onChange={onChangeHandler}>
                      <option value="">Choose...</option>
                      <option>Thiruvarur</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="zip" className="form-label">Zip</label>
                    <input type="number" className="form-control" id="zip" required name='zip' value={data.zip} onChange={onChangeHandler} />
                  </div>

                </div>

                <hr className="my-4" />

                <button className="w-100 btn btn-primary btn-lg" type="submit" disabled={cartItem.length ===0 ? true : false}>
                  Continue to checkout
                </button>

              </form>

            </div>

          </div>
        </main>
      </div>

    </div>
  );
}

export default PlaceOrder;