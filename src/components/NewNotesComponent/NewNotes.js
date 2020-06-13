import React, { useState, useEffect} from 'react';
import './NewNotes.css'
import axios from 'axios';
import { Link } from 'react-router-dom';

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

const useStyles = makeStyles(theme => ({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper
    },
    inline: {
      display: "inline"
    },
    pos: {
      marginBottom: 12
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    },
  }));

// How do we keep track of who is logged in?
function Notes(props) {
    const [regularUsers, setRegularUsers] = useState([]);
    const [noteTitle, setNoteTitle]  = useState("");
    const [noteDescription, setNoteDescription] = useState("");
    const classes = useStyles();


    // if i do useeffect will the regularUsers list load before i execute these commands?
    // shall i put this inside the useeffect?
    const regularUserEmail = props.regularUser; // if the regular user email can be from the Register component to the Notes component
    //const regUserObj = regularUsers.find(element => element.accountDTO.email == regularUserEmail);
    //const regUserId = regUserObj.id;
    const userIndex = regularUsers.findIndex(element => element.accountDTO.email == regularUserEmail);
    const regUserObj = regularUsers[userIndex]; //hmmm could this index change, probably, so what now? 

    const createNote = (title, description, regularUserId) => {
        axios.post("http://localhost:8080/createNote" + "?" + "title=" +  title + "&" + "description=" + description + "&" + "regularUserId=" + regularUserId).then(res => {
                // res -> holds the notes
                // add new note to array
                regUserObj.notes.push(res.data); 
            }
        ).catch(e => {
            console.log(e);
        });
    }

    const getAllRegularUsers = () => {
        axios.get("http://localhost:8080/getAllRegularUsers/").then(res => {
            setRegularUsers([...res.data]);
         }).catch(e => {
            console.log(e);
        });
    }

    // if the user wants to delete all their notes
    const deleteNotesByRegularUser = (regularUserId) => {
        axios.delete("http://localhost:8080/deleteNotesByRegularUser" + "?" + "regularUserId=" + regularUserId).then(() => {
                regUserObj.notes.length = 0;
                // or should i use splice or pop?
                /* while(regUserObj.notes.length > 0) {
                    regUser.Obj.notes.pop();
                } */
            }
        ).catch(e => {
            console.log(e);
        });
    }

    // not using result so what do i do in this case? for now used a parameterless function.
    const deleteNoteById = (noteId) => {
        axios.delete("http://localhost:8080/deleteNoteById" + "?" + "noteId=" + noteId).then( () => {
            let noteIndex = regUserObj.notes.findIndex(element => element.noteId == noteId);
            regUserObj.notes.splice(noteIndex, 1);
        }).catch(e => {
            console.log(e);
        });
    }

    const updateNoteByTitle = (title, noteId) => {
        axios.put("localhost:8080/updateNoteBTitle" + "?" + "title=" + title + "&" + "noteId=" + noteId).then(res => {
            let noteIndex = regUserObj.notes.findIndex(element => element.noteId == noteId);
            regUserObj.notes[noteIndex] = res.data;
        }

        )
    }

    const updateNoteByDescription = (description, noteId) => {
        axios.put("localhost:8080/updateNoteByDescription" + "?" + "description=" + description + "&" + "noteId=" + noteId).then(res => {
            let noteIndex = regUserObj.notes.findIndex(element => element.noteId == noteId);
            regUserObj.notes[noteIndex] = res.data;
        }
        )
    }

    useEffect (() => {
        getAllRegularUsers();
      })

    const addNoteHandler = (title, description, regUserId) => {
        createNote (title, description, regUserId);
    } 

    const [expanded, setExpanded] = React.useState('panel1');
  
    const handleChange = () => {
    
    };

    const handleSaveTitle = (title, id) => {
        updateNoteByTitle(title, id);
    }

    const handleSaveDescription = (description, id) => {
        updateNoteByDescription(description, id);
    }

    const handleDeleteNote = (id) => {
        deleteNoteById(id);
    }
      
    const noteData = [
        {
          title: "Last one for testinggg",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus fermentum ac erat non viverra. Maecenas elementum augue ac nibh porta viverra. Etiam sed volutpat ante. In ultrices lacinia est eget pretium. Nunc ac orci lectus. Pellentesque vestibulum libero eu nibh commodo, in dictum nunc dapibus. Quisque et accumsan diam. Nulla vel nunc facilisis ex fringilla eleifend. Sed fringilla mi velit, sed aliquam purus commodo sit amet. Interdum et malesuada fames ac ante ipsum primis in faucibus. In hac habitasse platea dictumst. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
          regularUser: {
            name: "Shalom"
          },
          date: "June 10th",
          featured: true
        },
        {
          title: "The title",
          description: "The description",
          regularUser: {
            name: "Shalom"
          },
          date: "June 10th",
          featured: true
        },
        {
          title: "Another title ya feel",
          description: "Another description ya feel",
          regularUser: {
            name: "Shalom"
          },
          date: "June 11th",
          featured: true
        }
      ];

 // how to make an icon the submit button?
    return ( //use noteTitle and noteDescription when ADDING a note
        <div className="container">
            <form className="form">
                <input className="notetitle" type="text" name="title" placeholder="Title" onChange={(e) => setNoteTitle(e.target.value)} />
                <textarea type="text" name="description" placeholder="What's on your mind?" onChange={(e) => setNoteDescription(e.target.value)}></textarea>
            </form>

            <div className="buttoncontainer">
                {/*After adding note, redirect user to list of all notes - put an add note button on this page, to redirect back to add notes page*/}
                <button type="button" className="buttonb" onClick={() => addNoteHandler(noteTitle, noteDescription, regUserObj.id)}>Add Note</button>
                <Link to="/displaynotes"><button type="button" className="buttonb">Display All Notes</button></Link>
            </div>
        </div>
    );


}

export default Notes;