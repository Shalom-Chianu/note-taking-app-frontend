import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import Login from './components/LoginComponent/Login.js';
import Register from './components/RegisterComponent/Register';
import Navbar from './components/NavbarComponent/Navbar';
import Homepage from './components/HomepageComponent/Homepage';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from "./Auth";
import NoteTakingApp from './components/HomepageComponent/NoteTakingApp'
import Layout from './components/LayoutComponent/Layout';
import { AuthContext } from './Auth';

function App() {
 const existingTokens = JSON.parse(localStorage.getItem("tokens"));
 const [authTokens, setAuthTokens] = useState(existingTokens);
 const [userStatus, setUserStatus] = useState("");
 
 const setTokens = (data) => {
   localStorage.setItem("tokens", JSON.stringify(data));
   setAuthTokens(data);
 }

 const { currentUser } = useContext(AuthContext);

 useEffect (() => {
  if( currentUser ) {
    setUserStatus("Logout");
  } else {
    setUserStatus("Login");
  }
 })

  return (
      <AuthProvider>
        <Router>
        <Navbar userStatus={userStatus} setUserStatus={setUserStatus} />
          <div className="rootcontainer">
            <Switch>
              <Route path="/" exact component={Homepage} />
              <Route path="/register" component={() => <Register userStatus={userStatus} setUserStatus={setUserStatus} />} />
              <Route path="/login" component={() => <Login userStatus={userStatus} setUserStatus={setUserStatus} />} />
              <PrivateRoute path="/layout" component={Layout} />
              <PrivateRoute path="/notetakingapp" component={NoteTakingApp} />
            </Switch>
          </div>
        </Router>
      </AuthProvider>
  ); 
}

export default App;
