import React, {useState, useEffect, useRef} from 'react';
import './Layout.css';
import { fade, makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';


const useStyles = makeStyles((theme) => ({

    search: {
        position: 'relative',
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        width: '100%',
        [theme.breakpoints.up('sm')]: {
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
        fontFamily: 'RobotoLight',

    },

    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
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
    const [currentNoteTitle, setCurrentNoteTitle] = useState("");
    const [currentNoteDescription, setCurrentNoteDescription] = useState("");
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
            let note = regularUserNotes.find(element => element.id == noteId)
            setCurrentNote(regularUserNotes.find(element => element.id == noteId));
            setCurrentNoteTitle(note.title)
            setCurrentNoteDescription(note.description)
            
          }
    };

    // const getCurrentNote = () => {
    //     if(currentNoteId != -1 && regularUserNotes) {
    //       console.log("This is the currentNote:" + currentNoteId);
    //       return regularUserNotes.find(element => element.id == currentNoteId);
    //     }
    // };

    const updateNoteById = (title, description, noteId) => {
        let url = description ? "http://localhost:8080/updateNoteById" + "?" + "title=" + title + "&" + "description=" + description + "&" + "noteId=" + noteId + "&regularUserId=" + regularUser.id: "http://localhost:8080/updateNoteById" + "?" + "title=" + title + "&" + "noteId=" + noteId + "&regularUserId=" + regularUser.id ;
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
        
        if(regularUserNotes){
            setCurrentNoteTitle(regularUserNotes[0].title);
            setCurrentNoteDescription(regularUserNotes[0].description);
        } else {
            setCurrentNoteTitle("");
            setCurrentNoteDescription("");
            setCurrentNoteId(regularUserNotes[0].id)
        }
        axios.delete("http://localhost:8080/deleteNoteById" + "?" + "noteId=" + noteId + "&" + "regularUserId=" + regularUser.id).then( () => {
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
            setCurrentNoteId(note.id);
            handleShowNote(note.id);
        
        }
        ).catch(e => {
            console.log(e);
        });

    } 

    const handleUpdate = (title, description, noteId) => {
        setCurrentNoteTitle(title);
        setCurrentNoteDescription(description);
        updateNoteById(title, description, noteId); 
    };

    const handleSearchChange = (searchWord) => {
        let currentList = [];
        let newList = [];
        if (searchWord !== "") {
            setFilterValue(true);
            currentList = regularUserNotes;
        
            newList = currentList.filter(item => {
                const body = item.title + item.description;
                return body.toLowerCase().includes(searchWord.toLowerCase());
            });

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

    return(
        <div className="container">
            <div className="column1">
                <div className="searchAndButtons">
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
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                    <div className="btn-group">
                        <button onClick={() => handleAddNote()}>ADD</button>
                        <button onClick={() => handleDeleteNote()}>DELETE</button>
                    </div>
                </div>
                {!filterValue ? renderDefaultListView() : renderFilteredListView()}
            </div>

            <div className="column2">
                <div className="titleDiv">
                <input
                    type="text"
                    key={currentNoteId}
                    value={currentNoteTitle}
                    className="title"
                    ref={inputRef}
                    onChange={(e) => handleUpdate(e.target.value, currentNote.description, currentNoteId)}
                />
                </div>
                <div className="descriptionDiv">
                <textarea 
                className="description"
                key = {currentNoteId + 1}
                value={currentNoteDescription}
                ref={textareaRef}
                onChange = {(e) => handleUpdate(currentNote.title, e.target.value, currentNoteId)}
                ></textarea>
                </div>
                </div>
        </div>
    );

}

export default Layout;
