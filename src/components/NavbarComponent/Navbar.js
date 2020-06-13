import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const style = {

    background : '#000000',
};

function Navbar() {
  const classes = useStyles();

  return (
      <div className={classes.root}>
          <AppBar style={style} position="static">
              <Toolbar>
                  <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                      <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" className={classes.title}>
                      <b>Note Taking App</b>
                  </Typography>
                  <Link to='/login' style={{ color: 'inherit', textDecoration: 'inherit' }}>
                      <Button color="inherit">Login</Button>
                  </Link>
                  <Link to='/register' style={{ color: 'inherit', textDecoration: 'inherit' }}>
                      <Button color="inherit">Register</Button>
                  </Link>
                  <Link to='/newnotes' style={{ color: 'inherit', textDecoration: 'inherit' }}>
                      <Button color="inherit">Add Note</Button>
                  </Link>
              </Toolbar>
          </AppBar>
      </div>
  );
}

export default Navbar;