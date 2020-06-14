import React, { useState, useEffect} from 'react';
import './NewNotes.css'
import axios from 'axios';
import { Link , Redirect} from 'react-router-dom';

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import ContentEditable from "react-contenteditable";
import Button from '@material-ui/core/Button';


// How do we keep track of who is logged in?
function Notes(props) {
    const [regularUsers, setRegularUsers] = useState([]);
    const [notes, setNotes] = useState([]);
    const [noteTitle, setNoteTitle]  = useState("");
    const [noteDescription, setNoteDescription] = useState("");

    useEffect (() => {
        getAllRegularUsers();
    })

    // Assuming useEffect can getAllNotes
    const regularUserEmail = props.regularUser; // if the regular user email can be from the Register component to the Notes component
    
    const regUserObj = regularUsers.find(element => element.accountDTO.email == regularUserEmail);
    const regUserId = 7;//regUserObj.id;

    //getAllNotesForRegularUser(regUserId); // populates notes arrays 

    const createNote = (title, description, regularUserId) => {
        axios.post("http://localhost:8080/createNote" + "?" + "title=" +  title + "&" + "description=" + description + "&" + "regularUserId=" + regularUserId).then(res => {
                // res -> holds the notes
                // add new note to array
             //   regUserObj.notes.push(res.data); 
            }
        ).catch(e => {
            console.log(e);
        });
    }

    const getAllNotesForRegularUser = (regUserId) => {
        axios.get("localhost:8080/getAllNotesForRegularUser" + "?" + "regularUserId=" + regUserId).then(res => {
            setNotes(...res);
        })
    }

    const getAllRegularUsers = () => {
        axios.get("http://localhost:8080/getAllRegularUsers/").then(res => {
            setRegularUsers([...res.data]);
         }).catch(e => {
            console.log(e);
        });
    } 

    const addNoteHandler = (title, description, regUserId) => {
        createNote (title, description, regUserId);
        let redirect = false;
        
        if (title != "" && description != "") {
            redirect = true;
        }

        if (redirect) {
            return (<Redirect to="/somewhere/else" />);
        }
    } 

 // how to make an icon the submit button?
    return ( //use noteTitle and noteDescription when ADDING a note
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

export default Notes;