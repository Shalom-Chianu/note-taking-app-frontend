import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/LoginComponent/Login';
import Register from './components/RegisterComponent/Register';



function App() {

  const [isLoginOpen, setIsLoginOpen] = useState(true);

  return (
  // <Register /> 
    <div className="root-container">
      { 
        isLoginOpen ? <Login/> : <Register />
      }
      <p className = "message">Don't have an account? <button className="button" onClick={() => {setIsLoginOpen(!isLoginOpen)}}>{isLoginOpen ? <p>Register</p> : <p>Login</p>}</button></p> {/*How to use Link and then style it*/}
    
    </div>
    
  );
}

export default App;
