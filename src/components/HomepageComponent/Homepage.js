import React, { useState, useEffect } from 'react';
import './Homepage.css';
import { Link } from 'react-router-dom';


function Homepage() {

    return (
        <div>
            <div className="Homepage-header">
                <h1>Note-Taking App</h1>
                <p>~ Logo thing ~</p>
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

