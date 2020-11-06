import React, { useState } from 'react';

import { useAuth } from '../contexts/AuthContext'

import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { AccessTime, EventSeat, People, ExitToApp } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import {useHistory} from "react-router-dom";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  floatingButton: {
    position: 'fixed',
    left: 20,
    bottom: 20
  },
  header: {
    padding: 20
  },
  nav:{
    marginBottom: 20
  }
});

const Nav = ({ title }) => {
  const classes = useStyles();
  const [menu, setMenu] = useState(false);
  
  const history = useHistory();
  const {loggedIn, logout} = useAuth();

  if(!loggedIn) return <> </>;

  return (<>
        <AppBar position="static" className={classes.nav}>
          <Toolbar>
            <IconButton 
              edge="start"
              color="inherit" 
              aria-label="menu" 
              onClick={() => setMenu(cu => !cu)} 
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={menu} onClose={() => setMenu(false)} onClick={() => setMenu(false)}>
            <div className={classes.list}>
            <h3 className={classes.header}>Grüne Gans</h3>
            <List>
                <ListItem button onClick={() => history.push('/tables')}>
                    <ListItemIcon><EventSeat /></ListItemIcon>
                    <ListItemText>Tables</ListItemText>
                </ListItem>
                <ListItem button onClick={() => history.push('/timeslots')}>
                    <ListItemIcon><AccessTime /></ListItemIcon>
                    <ListItemText>Time Slots</ListItemText>
                </ListItem>
                <ListItem button onClick={() => history.push('/bookings')}>
                    <ListItemIcon><People /></ListItemIcon>
                    <ListItemText>Bookings</ListItemText>
                </ListItem>
                <ListItem button onClick={logout}>
                    <ListItemIcon><ExitToApp /></ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </ListItem>
            </List>
            </div>
        </Drawer>
    </>)
}

export default Nav;
