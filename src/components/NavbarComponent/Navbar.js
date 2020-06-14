import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link, Redirect } from 'react-router-dom'
import { useAuth } from "../../context/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: '#ffffff',
  },
}));

const style = {

  background: '#000000',
};


function Navbar() {

  const classes = useStyles();
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  const isAuthenticated = useAuth();

  const handleLogOut = () => {
    setAuthTokens();
    localStorage.clear();
  }
  const handleLogIn = () => {
    console.log(existingTokens);
    return <Redirect to="/" />;
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

          {
            existingTokens ? <div> <Link to='/login' style={{ color: 'inherit', textDecoration: 'inherit' }}>
                  <Button color="inherit"
                    onClick={() => handleLogOut()}>Logout</Button>
                </Link> <Link to='/newnotes' style={{ color: 'inherit', textDecoration: 'inherit' }}>
                  <Button color="inherit">Add Note</Button>
                </Link> </div> : <div>  <Link to='/register' style={{ color: 'inherit', textDecoration: 'inherit' }}>
              <Button color="inherit">Register</Button>
            </Link>
              <Link to='/login' style={{ color: 'inherit', textDecoration: 'inherit' }}>  <Button color="inherit"
                onClick={() => handleLogIn()}>Login</Button> </Link> </div>
          }


        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;