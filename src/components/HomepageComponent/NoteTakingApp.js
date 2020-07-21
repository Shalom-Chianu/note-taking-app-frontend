import React, { useState, useEffect } from 'react';
import './Homepage.css';
import { Link } from 'react-router-dom';
import logo from './logo.png';



function Homepage() {

    return (
        <div>
            <div className="HomepageStyle">
                <img src={logo} width="60px" />
                <p className="slogan">Keep your notes closer</p>
                <h1>Your Note-Taking App</h1>
                <Link to="/layout" className="link">Display Notes</Link>
                
            </div>
        </div>
    ); 

}

export default Homepage;

