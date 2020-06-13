import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Collapse } from 'antd';
import '../NewNotesComponent/NewNotes.css'
import axios from 'axios';
import ContentEditable from "react-contenteditable";

const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world. A dog is a type of domesticated animal. Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world. A dog is a type of domesticated animal. Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

function DisplayNotes(props) {

    const [regularUsers, setRegularUsers] = useState([]);
    const [noteTitle, setNoteTitle]  = useState("");
    const [noteDescription, setNoteDescription] = useState("");

    // if i do useeffect will the regularUsers list load before i execute these commands?
    // shall i put this inside the useeffect?
    const regularUserEmail = props.regularUser; // if the regular user email can be from the Register component to the Notes component
    //const regUserObj = regularUsers.find(element => element.accountDTO.email == regularUserEmail);
    //const regUserId = regUserObj.id;
    
const userIndex = regularUsers.findIndex(element => element.accountDTO.email == regularUserEmail);
    const regUserObj = regularUsers[userIndex]; //hmmm could this index change, probably, so what now? 

    const createNote = (title, description, regularUserId) => {
        axios.post("http://localhost:8080/createNote" + "?" + "title=" +  title + "&" + "description=" + description + "&" + "regularUserId=" + regularUserId).then(res => {
                // res -> holds the notes
                // add new note to array
                regUserObj.notes.push(res.data); 
            }
        ).catch(e => {
            console.log(e);
        });
    }

    const getAllRegularUsers = () => {
        axios.get("http://localhost:8080/getAllRegularUsers/").then(res => {
            setRegularUsers([...res.data]);
         }).catch(e => {
            console.log(e);
        });
    }

    // if the user wants to delete all their notes
    const deleteNotesByRegularUser = (regularUserId) => {
        axios.delete("http://localhost:8080/deleteNotesByRegularUser" + "?" + "regularUserId=" + regularUserId).then(() => {
                regUserObj.notes.length = 0;
                // or should i use splice or pop?
                /* while(regUserObj.notes.length > 0) {
                    regUser.Obj.notes.pop();
                } */
            }
        ).catch(e => {
            console.log(e);
        });
    }

    // not using result so what do i do in this case? for now used a parameterless function.
    const deleteNoteById = (noteId) => {
        axios.delete("http://localhost:8080/deleteNoteById" + "?" + "noteId=" + noteId).then( () => {
            let noteIndex = regUserObj.notes.findIndex(element => element.noteId == noteId);
            regUserObj.notes.splice(noteIndex, 1);
        }).catch(e => {
            console.log(e);
        });
    }

    const updateNoteByTitle = (title, noteId) => {
        axios.put("localhost:8080/updateNoteBTitle" + "?" + "title=" + title + "&" + "noteId=" + noteId).then(res => {
            let noteIndex = regUserObj.notes.findIndex(element => element.noteId == noteId);
            regUserObj.notes[noteIndex] = res.data;
        }

        )
    }

    const updateNoteByDescription = (description, noteId) => {
        axios.put("localhost:8080/updateNoteByDescription" + "?" + "description=" + description + "&" + "noteId=" + noteId).then(res => {
            let noteIndex = regUserObj.notes.findIndex(element => element.noteId == noteId);
            regUserObj.notes[noteIndex] = res.data;
        }
        )
    }

    useEffect (() => {
        getAllRegularUsers();
      })

    const addNoteHandler = (title, description, regUserId) => {
        createNote (title, description, regUserId);
    } 

    const [expanded, setExpanded] = React.useState('panel1');
  
    const handleChange = () => {
    
    };

    const handleSaveTitle = (title, id) => {
        updateNoteByTitle(title, id);
    }

    const handleSaveDescription = (description, id) => {
        updateNoteByDescription(description, id);
    }

    const handleDeleteNote = (id) => {
        deleteNoteById(id);
    }
      
    const noteData = [
        {
          title: "Last one for testinggg",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus fermentum ac erat non viverra. Maecenas elementum augue ac nibh porta viverra. Etiam sed volutpat ante. In ultrices lacinia est eget pretium. Nunc ac orci lectus. Pellentesque vestibulum libero eu nibh commodo, in dictum nunc dapibus. Quisque et accumsan diam. Nulla vel nunc facilisis ex fringilla eleifend. Sed fringilla mi velit, sed aliquam purus commodo sit amet. Interdum et malesuada fames ac ante ipsum primis in faucibus. In hac habitasse platea dictumst. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
          regularUser: {
            name: "Shalom"
          },
          date: "June 10th",
          featured: true
        },
        {
          title: "The title",
          description: "The description",
          regularUser: {
            name: "Shalom"
          },
          date: "June 10th",
          featured: true
        },
        {
          title: "Another title ya feel",
          description: "Another description ya feel",
          regularUser: {
            name: "Shalom"
          },
          date: "June 11th",
          featured: true
        }
      ];

    return(
        <div className="container"> 
            <Collapse accordion className="panels">
                {/* Will replace noteData with regUserObj.notes.map(note => ) + corresponding fields */}
                {noteData.map(note => (
                    <Panel header={<ContentEditable
                        html={note.title}
                    />} className="panels">
                    <p className="panels">{<ContentEditable
                                        html={note.description}
                                        onChange={() => handleChange()}
                                    />}</p>
                </Panel>
                ))}
            </Collapse>
        </div>
    );

}

export default DisplayNotes;