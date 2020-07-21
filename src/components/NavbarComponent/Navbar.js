import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link, Redirect } from 'react-router-dom'
import './Navbar.css';
import app from "../../firebase.js";
import { AuthContext } from '../../Auth';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: '#ffffff',
    fontFamily: 'RobotoThin',
  },
  button: {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    fontFamily: 'RobotoLight',
  }
}));

const style = {
  background: '#000000',
};


function Navbar({userStatus, setUserStatus}) {

  const classes = useStyles();

  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [addNote, setAddNote] = useState("Register")
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const handleLogout = () => {
    if (JSON.parse(localStorage.getItem("tokens"))) {
      console.log("Logging out...");
      localStorage.clear();
      setUserStatus("Login");
      setAddNote("Register");
    }
  }

  const handleLogin = () => {
    localStorage.clear();
    setUserStatus("Logout")
    setAddNote("Add Note")
    console.log(" X Token: " + existingTokens);
  }

  const handleSubmit = () => { 
        app.auth().signOut();
        setUserStatus("Login");
   
  }

  return (
    <div className={classes.root}>
      <AppBar style={style} position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ color: 'inherit', textDecoration: 'inherit' }} className={classes.title}>
            <b>Note Taking App</b>
          </Typography>

            <div>
              <Link to='/login' className="button">
                <Button color="inherit" style={{ fontFamily: 'RobotoLight' }}
                   onClick={() => handleSubmit()}>
                  {userStatus}
                  </Button>
              </Link>
            </div>

        </Toolbar>
      </AppBar>
    </div>
  );
}


export default Navbar;