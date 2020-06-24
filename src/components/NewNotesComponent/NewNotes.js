import React, { useState, useEffect } from 'react';
import './NewNotes.css'
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

// How do we keep track of who is logged in?
function NewNotes() {
    const [regularUsers, setRegularUsers] = useState([]);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteDescription, setNoteDescription] = useState("");
    const existingTokens = JSON.parse(localStorage.getItem("tokens"));

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const getAllRegularUsers = () => {
            try {
                axios.get("http://localhost:8080/getAllRegularUsers/").then(res => {
                    setRegularUsers([...res.data]);
                });
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("cancelled");
                } else {
                    throw error;
                }
            }
        };

        getAllRegularUsers();

        return () => {
            source.cancel();
        };

    }, []);

    console.log(regularUsers);
    const regularUserEmail = existingTokens; // if the regular user email can be from the Register component to the Notes component
    console.log(regularUserEmail);
    const regUserObj = regularUsers.find(element => element.accountDTO.email == regularUserEmail);
    console.log(regUserObj);
    const regUserId = GetPropertyValue(regUserObj, "id");
    console.log(regUserId);

    function GetPropertyValue(obj1, dataToRetrieve) {
        return dataToRetrieve
          .split('.') // split string based on `.`
          .reduce(function(o, k) {
            return o && o[k]; // get inner property if `o` is defined else get `o` and return
          }, obj1) // set initial value as object
      }

    const createNote = (title, description, regularUserId) => {
        axios.post("http://localhost:8080/createNote/" + "?" + "title=" + title + "&" + "description=" + description + "&" + "regularUserId=" + regularUserId).then(res => {
            console.log(res.data);
        }
        ).catch(e => {
            console.log(e);
        });
    } 

    const addNoteHandler = (title, description, regUserId) => {
        createNote(title, description, regUserId);
          let redirect = false;
          
          if (title != "" && description != "") {
              redirect = true;
          }

          console.log(redirect);
  
          if (redirect) {
              return <Redirect to="/displaynotes" />;
          } 
    } 

    // how to make an icon the submit button?
    return ( 
        <div className="container">
            <form className="form">
                <input className="notetitle" type="text" name="title" placeholder="Title" onChange={(e) => setNoteTitle(e.target.value)} />
                <textarea className="notebody" type="text" name="description" placeholder="What's on your mind?" onChange={(e) => setNoteDescription(e.target.value)}></textarea>
            </form>

            <div className="buttoncontainer">
                {/*After adding note, redirect user to list of all notes - put an add note button on this page, to redirect back to add notes page*/}
                <button type="button" className="buttonb" onClick={() => addNoteHandler(noteTitle, noteDescription, regUserId)}>Add Note</button>
                <Link to="/displaynotes"><button type="button" className="buttonb">Display All Notes</button></Link>
            </div>
        </div>
    );


}

export default NewNotes;