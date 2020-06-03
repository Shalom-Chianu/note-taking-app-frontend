import React, { useState, useEffect } from 'react';
import './Register.css';
import axios from 'axios';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [regularUsers, setRegularUsers] = useState([]);

    const createAccount = (email, username) => {
        let promise = new Promise ( (resolve, reject) => { 
            resolve ( 
                axios.post("http://localhost:8080/createAccount/" + "?" + "email=" +  email + "&" + "username=" + username).then(res => {
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
                axios.post("http://localhost:8080/createRegularUser/" + "?" + "name=" +  name + "&" + "email=" + email + "&" + "username=" + username).then(res => {
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

   const registrationHandler = (email, username, name) => {
        createAccount (email, username).then (
            e => { 
                createRegularUser(name, email, username).then( e => { getAllRegularUsers() }); 
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
        axios.get("http://localhost:8080/getAllRegularUsers/").then(res => {
            setRegularUsers([...res.data]);
         })
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
                    Register
                    </div>
                    <div className="box">

                    <div className="input-group">
                        <label htmlFor="name">Name</label>
                        <input
                        type="text"
                        name="name"
                        className="login-input"
                        placeholder="Full Name" onChange = { (e) => setName(e.target.value) } />
                    </div>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                        type="text"
                        name="username"
                        className="login-input"
                        placeholder="Full Name" onChange = { (e) => setUsername(e.target.value) } />
                    </div>
    
                    <div className="input-group">
                        <label htmlFor="username">Email</label>
                        <input
                        type="text"
                        name="email"
                        className="login-input"
                        placeholder="Email" onChange = { (e) => setEmail(e.target.value) } />
                    </div>
    
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                        type="password"
                        name="password"
                        className="login-input"
                        placeholder="Password" onChange = { (e) => setPassword(e.target.value)} />
                    </div>
    
                   <button
                    type="button"
                    className="login-btn"
                    onClick = { () => registrationHandler(name, email, username)}>Create Account
                    </button>

                <div>
                    <p className = "message">Already have an account? <a href="#">Login.</a></p>
                </div>
    
                    </div>
                </div>
            </div>
        </div>
    
      );
}

export default Register;