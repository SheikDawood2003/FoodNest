import React, { useState } from 'react';
import './Register.css';
import {Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../../service/AuthService';

function Register() {

    const [data, setData] = useState({
        name: '',
        email : '',
        password : ''
    });

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setData( data => ({...data, [name] : value}));
    }

    const onSubmitHandler = async (event) =>{
        event.preventDefault();
        try {
            const response = await registerUser(data);
            if(response.status === 201){
                toast.success("Registration completed. Please Login")
                navigate("/login");
            }
            else{
                toast.error('Unable to register. Please try again');
            }
        } catch (error) {
            toast.error('Unable to register. Please try again');
            console.log(error);
            
        }
    }
  return (
    <div className="register-container">
        <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div className="card border-0 shadow rounded-3 my-5">
                    <div className="card-body p-4 p-sm-5">
                        <h5 className="card-title text-center mb-5 fw-light fs-5">Register</h5>
                        <form onSubmit={onSubmitHandler}>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="Maran"name='name' onChange={onChangeHandler} value={data.name} required />
                                <label htmlFor="floatingInput">Full Name</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" name='email' onChange={onChangeHandler} value={data.email} required />
                                <label htmlFor="floatingInput">Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" name='password' onChange={onChangeHandler} value={data.password} required />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            <div className="d-grid">
                                <button className="btn btn-outline-primary btn-login text-uppercase" type="submit">Register</button>
                            </div>
                            <div className="d-grid mt-2">
                                <button className="btn btn-outline-danger btn-login text-uppercase" type="reset">Reset</button>
                            </div>
                            <div className='mt-4'>
                                Already have an account? <Link to={"/login"} className='text-decoration-none'>Login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register;