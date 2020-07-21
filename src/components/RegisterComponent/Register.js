import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../LoginComponent/Login.css';
import {Link} from 'react-router-dom';
import app from "../../firebase.js";
import { withRouter, Redirect } from "react-router";

function Register({history, setUserStatus}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [regularUsers, setRegularUsers] = useState([]);

    const createAccount = (email, username) => {
        let promise = new Promise ( (resolve, reject) => { 
            resolve ( 
                axios.post("https://note-taking-app-backend-01.herokuapp.com/createAccount/" + "?" + "email=" +  email + "&" + "username=" + username).then(res => {
                console.log(res); 
                }
            ).catch(e => {
                console.log(e);
                console.log(email + " " + password);
                return reject;
            }));
        })
        return promise;
    }

    const createRegularUser = (name, email, username) => {
        let promise = new Promise ( (resolve, reject) => {
            resolve (
                axios.post("https://note-taking-app-backend-01.herokuapp.com/createRegularUser/" + "?" + "name=" +  name + "&" + "email=" + email + "&" + "username=" + username).then(res => {
                console.log(res);
            }
            ).catch(e => {
                console.log(e);
                console.log(name + " " + email + " " + username);
                return reject;
          }));
        })
        return promise;
    }

   const registrationHandler = (name, email, username, password) => {
        createAccount (email, username)
        .then (
            e => { 
                createRegularUser(name, email, username)
        .then( 
            e => { 
                getAllRegularUsers()
        .then (
            e => {
                app.auth().createUserWithEmailAndPassword(email, password).then(
                    e => {
                        history.push("/notetakingapp");
                        if (setUserStatus) {
                            setUserStatus("Logout");
                        } 
                    }
                );
            }
        )
       }); 
            }
        ).catch(e =>  { 
            console.log(e);
            }
        )
    } 

  /*  useEffect ( () => {
     //  registrationHandler("shalomchianu@gmail.com", "ShaKenChi", "Shalom");
        getAllRegularUsers();
    }); */

    const getAllRegularUsers = () => {
        let promise = new Promise((resolve, reject) => {
            resolve(
                axios.get("https://note-taking-app-backend-01.herokuapp.com/getAllRegularUsers/").then(res => {
                    setRegularUsers([...res.data]);
                }
                ).catch(e => {
                    console.log(e);
                    return reject;
                }));
        })
        return promise;
    } 
    

    return (
        <div className="root-container">

            <div className="subtitle">
                <p>Jotter</p>
            </div>

            <div className="box-container">
                <div className="inner-container">
                    <div className="header">
                        REGISTER
                    </div>
                    <div className="box">

                        <div className="input-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="login-input"
                                placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="login-input"
                                placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                        </div>

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
                            onClick={() => registrationHandler(name, email, username, password)}>Create Account
                    </button>

                        <div>
                            <p className="message">Already have an account? <Link to="/login" className="littleLink">
                                Login
                    </Link></p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    
      );
}

export default withRouter(Register);