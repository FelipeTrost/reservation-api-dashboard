import React, { useState } from 'react';

import { useAuth } from '../contexts/AuthContext'

import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Fab, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Navigation, Home, AccessTime, EventSeat, People, ExitToApp } from '@material-ui/icons';
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
  }
});

const Nav = () => {
  const classes = useStyles();
  const [menu, setMenu] = useState(false);
  
  const history = useHistory();
  const {loggedIn, logout} = useAuth();

  if(!loggedIn) return <> </>;

  return (<>
        <Drawer anchor="left" open={menu} onClose={() => setMenu(false)} onClick={() => setMenu(false)}>
            <div className={classes.list}>
            <h3 className={classes.header}>Grüne Gans</h3>
            <List>
                <ListItem button onClick={() => history.push('/')}>
                    <ListItemIcon><Home /></ListItemIcon>
                    <ListItemText>Start</ListItemText>
                </ListItem>
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

        <Fab variant='extended' className={classes.floatingButton} aria-label="Menu" onClick={() => setMenu(cu => !cu)  }>
        <Navigation className={classes.extendedIcon} />
        Menu
        </Fab>
    </>)
}

export default Nav;
