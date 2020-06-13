import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/LoginComponent/Login.js';
import Register from './components/RegisterComponent/Register';
import NewNotes from './components/NewNotesComponent/NewNotes';
import Navbar from './components/NavbarComponent/Navbar';
import Homepage from './components/HomepageComponent/Homepage';
import DisplayNotes from './components/DisplayNotesComponent/DisplayNotes';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {

 // const [isLoginOpen, setIsLoginOpen] = useState(true);

  return (
    <Router>
      <Navbar />
      <div className="rootcontainer">
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/newnotes" component={NewNotes} />
          <Route path="/displaynotes" component={DisplayNotes} />
        </Switch>
      </div>
    </Router>
  ); 
}

export default App;
