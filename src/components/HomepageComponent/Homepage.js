import React, { useState, useEffect } from 'react';
import './Homepage.css';
import { Link } from 'react-router-dom';
import logo from './logo.png';


function Homepage() {

    return (
        <div>
            <div className="HomepageStyle">
                <img src={logo} width="60px" />
                <h1 className="pagetitle">Note-Taking App</h1>
                <div className="buttoncontainer">
                    <Link to="/login">
                        <button className="loginb" onClick >
                            Login
                    </button>
                    </Link>
                    <Link to="/register">
                        <button className="registerb">
                            Register
                    </button>
                    </Link>
                </div>
            </div>
        </div>
    ); 

}

export default Homepage;

