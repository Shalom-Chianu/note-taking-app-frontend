import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/LoginComponent/Login.js';
import Register from './components/RegisterComponent/Register';
import NewNotes from './components/NewNotesComponent/NewNotes';
import Navbar from './components/NavBarComponent/Navbar'
import Homepage from './components/HomepageComponent/Homepage';
import DisplayNotes from './components/DisplayNotesComponent/DisplayNotes';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PseudoAccessRoute from './PseudoAccessRoute'
import { AuthContext } from "./context/auth";
import NoteTakingApp from './components/HomepageComponent/NoteTakingApp'
import EditNotes from './components/DisplayNotesComponent/EditNotes';
import Layout from './components/LayoutComponent/Layout';

function App() {

 // const [isLoginOpen, setIsLoginOpen] = useState(true);
 const existingTokens = JSON.parse(localStorage.getItem("tokens"));
 const [authTokens, setAuthTokens] = useState(existingTokens);
 
 const setTokens = (data) => {
   localStorage.setItem("tokens", JSON.stringify(data));
   setAuthTokens(data);
 }
  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
    <Router>
      <Navbar />
      <div className="rootcontainer">
        <Switch>
          <PseudoAccessRoute path="/" exact component={Homepage} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/editnotes" component={EditNotes} />
          <Route path="/layout" component={Layout} />
          <PrivateRoute path="/newnotes" component={NewNotes}>
          </PrivateRoute>
          <PrivateRoute path="/displaynotes" component={DisplayNotes}>
   
          </PrivateRoute>
          <PrivateRoute path="/notetakingapp" component={NoteTakingApp} >

          </PrivateRoute>
          
         
        
        </Switch>
      </div>
    </Router>
    </AuthContext.Provider>
  ); 
}

export default App;
