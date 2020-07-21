import React, { useState, useEffect, useContext } from 'react';
import './Login.css';
import axios from 'axios';
import { Link,  Redirect, withRouter } from 'react-router-dom';
import app from '../../firebase.js';
import { AuthContext } from '../../Auth';

function Login({ history, setUserStatus }) {
  
  // Declare a new state variable
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // doubles as username for now
  const [regularUsers, setRegularUsers] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);

  const getAccountByEmail = (email) => {
    axios.post("https://note-taking-app-backend-01.herokuapp.com/getAccountByEmail/" + "?" + "email=" +  email).then(res => {
        console.log(res);
    }).catch(e => {
        console.log(e);
        console.log(email);
    })
  }

  useEffect (() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const getAllRegularUsers = () => {
      try {
        axios.get("https://note-taking-app-backend-01.herokuapp.com/getAllRegularUsers/").then(res => {
          setRegularUsers([...res.data]);
        });
      } catch(error) {
        if (axios.isCancel(error)) {
          console.log("cancelled");
        } else {
          throw error;
        }
      }
    };

    getAllRegularUsers();

    return() => {
      source.cancel();
    };
   
  }, []);

  const handleSubmit = (email, password) => {
      // let included = false;

      // console.log(regularUsers);

      // // may need to change the username = password thing -> for testing purposes
      // for (const ele of regularUsers) {
      //   if (ele.accountDTO.email == email && ele.accountDTO.username == password) {
      //       included = true; 
      //       break;
      //   }
      // }

      app.auth().signInWithEmailAndPassword(email, password);
      history.push("/notetakingapp");

      if (setUserStatus) {
        setUserStatus("Logout");
      }

    //   if (included) {
    //    // <Notes regularUser={email}/>
    //    setAuthTokens(email);
    //    setLoggedIn(true);

    //   } else {
    //     setIsError(true);
    //     throw new Error("Email or password may be incorrect");
    // }

  }

  const { currentUser } = useContext(AuthContext);

  if( currentUser ) {
    return <Redirect to="/notetakingapp" />
  }

  return (
    <div className="root-container">
      <div className="subtitle">
        <p>Jotter</p>
      </div>
      <div className="box-container">
        <div className="inner-container">
          <div className="header">
            LOGIN
                </div>
          <div className="box">

            <div className="input-group">
              <label htmlFor="username">Email</label>
              <input
                type="text"
                name="email"
                className="login-input"
                placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                className="login-input"
                placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button
              type="button"
              className="login-btn"
              onClick={() => handleSubmit(email, password)}>Login
                </button>

            <div>
              <p className="message">Don't have an Account? <Link to="/register" className="littleLink">
                Register
                  </Link></p>
            </div>


          </div>
        </div>
      </div>
    </div>

  );

  
}

export default withRouter(Login);
