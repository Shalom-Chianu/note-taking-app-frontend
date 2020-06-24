import React , { useEffect, useState, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Editable from "./Editable";
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { Input } from '@material-ui/core';
import { fontFamily } from '@material-ui/system';
import { black } from 'color-name';
import './DisplayNotes.css';


const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  TextField: {
    fontFamily: "sans-serif",
    color: "black",
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

function EditNotes() {
  const [open, setOpen] = React.useState(false);
  const inputRef = useRef();
  const textareaRef = useRef();
  const [regularUser, setRegularUser] = useState({});
  const [regularUserNotes, setRegularUserNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(-1);
  const classes = useStyles();

  const handleClickOpen = (noteId) => {
    setCurrentNote(noteId);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setCurrentNote(-1);

  };

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

const getCurrentNote = () => {
    if(currentNote != -1 && regularUserNotes) {
      return regularUserNotes.find(element => element.id == currentNote);
    }
}

const updateNoteByTitle = (title, noteId) => {
  axios.put("http://localhost:8080/updateNoteByTitle" + "?" + "title=" + title + "&" + "noteId=" + noteId).then(res => {
            /*let noteIndex = regUserObj.notes.findIndex(element => element.noteId == noteId);
            regUserObj.notes[noteIndex] = res.data; */
      console.log(res.data);
  }).catch(e => {
      console.log(e);
  });
}

const updateNoteById = (title, description, noteId) => {
  axios.put("http://localhost:8080/updateNoteById" + "?" + "title=" + title + "&" + "description=" + description + "&" + "noteId=" + noteId).then(res => {
            /*let noteIndex = regUserObj.notes.findIndex(element => element.noteId == noteId);
            regUserObj.notes[noteIndex] = res.data;*/
      console.log(res.data);
  }).catch(e => {
      console.log(e);
  });

}

const handleSave = () => {
  const note = getCurrentNote();
  if (currentNote != -1 && note) {
      updateNoteById(note.title, note.description, currentNote);
  }
  setCurrentNote(-1);
  setOpen(false);    
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
    if (regularUserNotes) {
        const index = regularUserNotes.findIndex(element => element.id == noteId);
        const note = regularUserNotes.find(element => element.id == noteId);
        if (note) {
            note.description = val;
            setRegularUserNotes(regularUserNotes.splice(index, 1, note));
        }
    } 
}

  return (
    <div>
      <div className="userNotes">
        {regularUserNotes && regularUserNotes.map(note => (
          <div className="note" key={note.id}>
            <form>
              <div>
               {note.title}
              </div>
              <div>
                {note.description}
              </div>
            </form>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => handleClickOpen(note.id)}
              endIcon={<EditIcon>Edit</EditIcon>}
            >
              Edit
            </Button>
            {/* <button onClick={() => handleDelete(note.id)}>Delete</button> */}
            <hr />
          </div>
        ))}
      </div>


      <div className="userNotes">
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        <TextField
            inputProps={{style:{fontFamily: "sans-serif", color: "black", fontSize: "20px"}}}
            autoFocus
            margin="dense"
            id="title"
            label="title"
            type="text"
            fullWidth
            defaultValue={getCurrentNote() ? getCurrentNote().title : ""}
            // onChange={e => updateNoteTitle(e.target.value, currentNote)}
            onChange={(e) => updateNoteById(e.target.value, getCurrentNote().description, currentNote)}
          />
        </DialogTitle>
        <DialogContent dividers>
          <TextareaAutosize 
          style={{border:"none",
            overflow: "auto",
            outline: "none",
            WebkitBoxShadow: "none",
            MozBoxshadow: "none",
            boxShadow: "none",
            resize: "none",
            minWidth: "600px",
            fontFamily: "sans-serif",
            fontSize: "20px"}}
          rowsMin={15}
          aria-label="empty textarea" 
          defaultValue={getCurrentNote() ? getCurrentNote().description : ""} 
          onChange={e => updateNoteDescription(e.target.value, currentNote)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    </div>
  );
}

export default EditNotes;