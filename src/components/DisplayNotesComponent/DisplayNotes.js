import React, { useEffect, useState, useRef } from 'react';
import './DisplayNotes.css';
import axios from 'axios';
import Editable from "./Editable";

function DisplayNotes() {
    const inputRef = useRef();
    const textareaRef = useRef();
    const [regularUser, setRegularUser] = useState({});
    const [regularUserNotes, setRegularUserNotes] = useState([]);


    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const existingTokens = JSON.parse(localStorage.getItem("tokens"));

        const getRegularUserByEmail = (email) => {
            try {
                axios.get("http://localhost:8080/getRegularUserByEmail/" + "?" + "email=" + email).then(res => {
                    setRegularUser(res.data);
                });
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("cancelled");
                } else {
                    throw error;
                }
            }
        };

        getRegularUserByEmail(existingTokens);

        return () => {
            source.cancel();
        };

    }, []);

    useEffect(() => {
        function getPropertyValue(obj1, dataToRetrieve) {
            return dataToRetrieve
                .split('.') // split string based on `.`
                .reduce(function (o, k) {
                    return o && o[k]; // get inner property if `o` is defined else get `o` and return
                }, obj1) // set initial value as object
        }

        const getNotesForRegularUser = () => {
            const notes = getPropertyValue(regularUser, "notes");
            setRegularUserNotes(notes);
        }

        getNotesForRegularUser();
    });

    const updateNoteByTitle = (title, noteId) => {
        axios.put("http://localhost:8080/updateNoteByTitle" + "?" + "title=" + title + "&" + "noteId=" + noteId).then(res => {
            /*let noteIndex = regUserObj.notes.findIndex(element => element.noteId == noteId);
            regUserObj.notes[noteIndex] = res.data; */
            console.log(res.data);
        }).catch(e => {
            console.log(e);
        });
    }

    const updateNoteByDescription = (description, noteId) => {
        axios.put("http://localhost:8080/updateNoteByDescription" + "?" + "description=" + description + "&" + "noteId=" + noteId).then(res => {
            /*let noteIndex = regUserObj.notes.findIndex(element => element.noteId == noteId);
            regUserObj.notes[noteIndex] = res.data;*/
            console.log(res.data);
        }).catch(e => {
            console.log(e);
        });
    }

    const deleteNoteById = (noteId) => {
        axios.delete("http://localhost:8080/deleteNoteById" + "?" + "noteId=" + noteId).then( () => {
            // let noteIndex =regularUserNotes.findIndex(element => element.noteId == noteId);
            // regUserObj.notes.splice(noteIndex, 1);
        }).catch(e => {
            console.log(e);
        });
    }

    const updateNoteTitle = (val, noteId) => {
        if (regularUserNotes) {
            const index = regularUserNotes.findIndex(element => element.id == noteId);
            const note = regularUserNotes.find(element => element.id == noteId);
            if (note) {
                note.title = val;
                setRegularUserNotes(regularUserNotes.splice(index, 1, note));
            }
        } 
    }

    const updateNoteDescription = (val, noteId) => {
        console.log('In onChange');
        if (regularUserNotes) {
            const index = regularUserNotes.findIndex(element => element.id == noteId);
            const note = regularUserNotes.find(element => element.id == noteId);
            console.log('gotten note');
            if (note) {
                note.description = val;
                setRegularUserNotes(regularUserNotes.splice(index, 1, note));
                console.log('updated note');
            }
        } 
        console.log(textareaRef.current.value);
    }

    const handleDelete = (noteId) => {
        if (regularUserNotes) {
            const index = regularUserNotes.findIndex(element => element.id == noteId);
            setRegularUserNotes(regularUserNotes.splice(index, 1));
            deleteNoteById(noteId);
        }
    }

    // TO DO:
    // Add Edit/Cancel button -> so changes can be undone
    // Add Delete [\/]

    // For edit, how do we check wh

    return(
        <div className="containerD">
            <div className="userNotes">
                {regularUserNotes && regularUserNotes.map(note => (
                    <div className={`note_${note.id}`} key={note.id}>
                        <form>
                            <div>
                                <Editable
                                    key={note.id}
                                    text={note.title}//huh?
                                    childRef={inputRef}
                                    type="input">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        name="title"
                                        defaultValue={note.title}
                                        onChange={e => updateNoteTitle(e.target.value, note.id)}
                                    />
                                </Editable>
                            </div>
                            <div>
                                <Editable
                                    key={note.id}
                                    text={note.description}//huh?
                                    childRef={textareaRef}
                                    type="textarea">
                                    <textarea
                                        className="notebody"
                                        ref={textareaRef}
                                        type="text"
                                        name="description"
                                        defaultValue={note.description}
                                        onChange={e => updateNoteDescription(e.target.value, note.id)}
                                    />
                                </Editable>
                            </div>
                        </form>
                        <button>Edit</button>
                        <button onClick={() => handleDelete(note.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default DisplayNotes; 