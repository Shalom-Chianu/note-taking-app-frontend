import React, {useState, useEffect, useRef} from 'react';
import './Layout.css';
import { fade, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { black } from 'color-name';
import axios from 'axios';
import { Input } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
       marginLeft: theme.spacing(0),
       marginRight: theme.spacing(2),
       width: '25ch',
    },
    root: {
        '& > *': {
          margin: theme.spacing(1),
        },
      },

    weight: {
        fontWeight: "bolder",
        spacing: '10px',
        fontFamily: 'RobotoBlack',
    },

    search: {
        position: 'relative',
        //borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        width: '100%',
        [theme.breakpoints.up('sm')]: {
        //   marginLeft: theme.spacing(1),
          width: 'auto',
        },
    },
    
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputRoot: {
        color: 'inherit',
    },

    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
  }));

function Layout() {
    const classes = useStyles();
    const [regularUser, setRegularUser] = useState({});
    const [regularUserNotes, setRegularUserNotes] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [filterValue, setFilterValue] = useState(false);
    const [currentNoteId, setCurrentNoteId] = useState(-1);
    const [currentNote, setCurrentNote] = useState({});
    const inputRef = useRef();
    const textareaRef = useRef();


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

    const handleShowNote = (noteId) => {
        setCurrentNoteId(noteId);
        if(noteId != -1 && regularUserNotes) {
            setCurrentNote(regularUserNotes.find(element => element.id == noteId));
          }
    };

    // const getCurrentNote = () => {
    //     if(currentNoteId != -1 && regularUserNotes) {
    //       console.log("This is the currentNote:" + currentNoteId);
    //       return regularUserNotes.find(element => element.id == currentNoteId);
    //     }
    // };

    const updateNoteById = (title, description, noteId) => {
        let url = description ? "http://localhost:8080/updateNoteById" + "?" + "title=" + title + "&" + "description=" + description + "&" + "noteId=" + noteId : "http://localhost:8080/updateNoteById" + "?" + "title=" + title + "&" + "noteId=" + noteId;
        axios.put(url).then(res => {
                // update Regular User State?

                if (regularUserNotes) {
                    const index = regularUserNotes.findIndex(element => element.id == noteId);
                    setRegularUserNotes(regularUserNotes.splice(index, 1, res.data));
                    setCurrentNote(res.data);

                }


            console.log(res.data);
        }).catch(e => {
            console.log(e);
        });  
    };

    const deleteNoteById = (noteId) => {
        axios.delete("http://localhost:8080/deleteNoteById" + "?" + "noteId=" + noteId).then( () => {
            // let noteIndex =regularUserNotes.findIndex(element => element.noteId == noteId);
            // regUserObj.notes.splice(noteIndex, 1);
        }).catch(e => {
            console.log(e);
        });
    }

    const createNote = (title, description, regularUserId) => {
        let note = {};

        axios.post("http://localhost:8080/createNote/" + "?" + "title=" + title + "&" + "description=" + description + "&" + "regularUserId=" + regularUserId).then(res => {
            note = {...res.data}
            regularUserNotes.unshift(note);
            handleShowNote(note.id);
            console.log(note);
        }
        ).catch(e => {
            console.log(e);
        });

    } 

    const handleUpdate = (title, description, noteId) => {
        console.log("This is the title: " + title);
        console.log("This is the description: " + description);
        console.log("This is the note id: " + noteId);
        updateNoteById(title, description, noteId); 
    };

    const renderDefaultListView = () => {
        return <div className="userNotes">
            {regularUserNotes && regularUserNotes.map(note => (
                <div className={currentNoteId == note.id ? "notehighlight" : "note"} key={note.id} onClick={() => handleShowNote(note.id)}>
                    <span className="sideTitle" id="text">{note.title}</span>
                    <span className="sideDescription" id="text">{note.description}</span>
                    <span className="sideDate" id="text">{note.date}</span>
                </div>
            ))}
        </div>
    }

    const renderFilteredListView = () => {
        return <div className="userNotes"> 
        {filteredList && filteredList.map(note => (
            <div className={currentNoteId == note.id ? "notehighlight" : "note"} key={note.id} onClick={ () => handleShowNote(note.id)}>
                <span className="sideTitle" id="text">{note.title}</span>
                <span className="sideDescription" id="text">{note.description}</span>
                <span className="sideDate" id="text">{note.date}</span>
            </div>
        ))}
        </div>
    }

    const handleSearchChange = (searchWord) => {
        let currentList = [];
        let newList = [];
        if (searchWord !== "") {
            setFilterValue(true);
            currentList = regularUserNotes;
            console.log(searchWord);
            console.log(currentList);
            newList = currentList.filter(item => {
                const body = item.title + item.description;
                console.log(body);
                return body.toLowerCase().includes(searchWord.toLowerCase());
            });
            console.log(newList);

            setFilteredList(newList);
        } else {
            newList = regularUserNotes;
            setFilteredList(newList);
        }
    }

    const handleDeleteNote = () => {
        if (currentNoteId != -1 && regularUserNotes) {
            const index = regularUserNotes.findIndex(element => element.id == currentNoteId);
            setRegularUserNotes(regularUserNotes.splice(index, 1));
            deleteNoteById(currentNoteId);
        }
    }

    const handleAddNote = () => {
        let title = "Note" + (regularUserNotes.length + 1);
        let description = "";
        createNote(title, description, regularUser.id);
    }


    return(
        <div className="container">
            <div className="column1">
                    <div className={classes.search}>
                    <div className={classes.searchIcon}>
                    <SearchIcon />
                    </div>
                    <InputBase
                    placeholder="Search…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    onChange = {(e) => handleSearchChange(e.target.value)}
                    />
                    </div>
                    <div className="btn-group">
                        <button onClick={() => handleAddNote()}>Add</button>
                        <button onClick={() => handleDeleteNote()}>Delete</button>
                    </div>
                    {!filterValue ? renderDefaultListView() : renderFilteredListView()}
            </div>

            <div className="column2">
                <div className="userNotes">
                <input
                    type="text"
                    key = {currentNoteId}
                    defaultValue={currentNote.title} /*{getCurrentNote() ? getCurrentNote().title : ""}*/
                    style={{ margin: 8,}}
                    className="title"
                    ref={inputRef}
                    onChange = {(e) => handleUpdate(e.target.value, currentNote.description, currentNoteId)}
                />
                <textarea 
                className="description"
                key = {currentNoteId + 1}
                defaultValue={currentNote.description}/*{getCurrentNote() ? getCurrentNote().description : ""}*/
                ref={textareaRef}
                onChange = {(e) => handleUpdate(currentNote.title, e.target.value, currentNoteId)}
                ></textarea>
                </div>
            </div>
        </div>
    );

}

export default Layout;
