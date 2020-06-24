import React, {useState, useEffect} from 'react';
import './Layout.css';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { black } from 'color-name';
import axios from 'axios';

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
    },
  }));

function Layout() {
    const classes = useStyles();
    const [regularUser, setRegularUser] = useState({});
    const [regularUserNotes, setRegularUserNotes] = useState([]);
    const [currentNoteId, setCurrentNoteId] = useState(-1);

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const existingTokens = JSON.parse(localStorage.getItem("tokens"));

    useEffect(() => {
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

    const getShortTitle = (title) => {
        
    }

    return(
        <div className="container">
            <div className="column1">
                    <button className='addbutton'>
                        Add Note
                    </button>
                    <hr style={{  border: '1px solid rgb(36, 47, 122)'}}></hr>
                    <div className="userNotes"> 
                    {regularUserNotes && regularUserNotes.map(note => (
                        <div className="note" key={note.id}>
                            <span className="sideTitle" id="text">{note.title}</span><br />
                            <span className="sideDescription" id="text">{note.description}</span><br />
                            <span className="sideDate" id="text">{note.date}</span>
                        </div>
                    ))}
                    </div>
            </div>
            <div className="column2">
                <TextField
                    id="standard-full-width"
                    label="TITLE"
                    style={{ margin: 8, letterSpace: 10,}}
                    placeholder="New Note"
                    fullWidth
                    margin="normal"
                    className="title"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        classes: {
                            input: classes.weight,
                        },
                    }}
                /><textarea className="description"></textarea>
            </div>
        </div>
    );

}

export default Layout;
