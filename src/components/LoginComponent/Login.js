import React, { useState, useEffect } from 'react';
import './Login.css';
import axios from 'axios';
import Notes from '../NewNotesComponent/NewNotes';
import { Link,  Redirect } from 'react-router-dom';
import { useAuth } from "../../context/auth";
//import { Route , withRouter} from 'react-router-dom';

function Login() {
  
  // Declare a new state variable
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // doubles as username for now
  const [regularUsers, setRegularUsers] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const { setAuthTokens } = useAuth();

  const getAccountByEmail = (email) => {
    axios.post("http://localhost:8080/getAccountByEmail/" + "?" + "email=" +  email).then(res => {
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
        axios.get("http://localhost:8080/getAllRegularUsers/").then(res => {
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

  const handleSubmit = (email) => {
      let included = false;
      let email1 = "";
      let username = "";

      console.log(regularUsers);

      // may need to change the username = password thing -> for testing purposes
      for (const ele of regularUsers) {
        if (ele.accountDTO.email == email && ele.accountDTO.username == password) {
            included = true; 
            email1 = ele.accountDTO.email;
            username = ele.accountDTO.username;
            break;
        }
      }

      if (included) {
       // <Notes regularUser={email}/>
       setAuthTokens(email);
       setLoggedIn(true);

      } else {
        setIsError(true);
        throw new Error("Email or password may be incorrect");
    }

  }

  if(isLoggedIn){
    return <Redirect to="/notetakingapp" />
  }
  return (
    <div className="root-container">

      <div className="title">
        <h1>Note-Taking App</h1>
      </div>

      <div className="subtitle">
        <p>(Subtitle)</p>
      </div>

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
              onClick={() => handleSubmit(email)}>Login
                </button>

            <div>
              <p className="message">Don't have an Account? <Link to="/register">
                Register
                  </Link></p>
            </div>


          </div>
        </div>
      </div>
    </div>

  );

  
}

export default Login;
