import React, { useState } from 'react';
import './Login.css';

function Login() {
  
  // Declare a new state variable
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <div className="root-container">
        <div className="box-container">
            <div className="inner-container">
                <div className="header">
                Login
                </div>
                <div className="box">

                <div className="input-group">
                    <label htmlFor="username">Email</label>
                    <input
                    type="text"
                    name="email"
                    className="login-input"
                    placeholder="Email" onChange = { (e) => setEmail(e.target.value) } />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                    type="password"
                    name="password"
                    className="login-input"
                    placeholder="Password" onChange = { (e) => setPassword(e.target.value)} />
                </div>

                <button
                    type="button"
                    className="login-btn">Login</button> 

                </div>
            </div>
        </div>
    </div>

  );

  
}

export default Login;
