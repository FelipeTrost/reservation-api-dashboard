import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {api_url} from '../config';
import { Table, TableCell, TableRow, TableContainer, TableHead, TableBody, Fab, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { Create, Delete, Add, Refresh } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const useStyles = makeStyles(theme => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  floatingButton: {
    position: 'fixed',
    right: 20,
    bottom: 20
  },
}));

const Bookings = () => {
  const classes = useStyles();

  // const [addPopup, setAddPopup] = useState(false);

  const [bookings, setBookings] = useState([]);
  const {requestApi} = useAuth();
  const [dateInput, setDateInput] = useState(new Date());

  const getBookings = () => {
    const year = dateInput.getFullYear();
    const month = dateInput.getMonth() + 1;
    const day = dateInput.getDate();

    requestApi(api_url + "/api/modify/booking", "GET", {
      year,
      month,
      day
    })
    .then(response => {
      console.log(response);
      if(response.success && response.response)
        setBookings(response.response);
      else
        alert('Something went wrong');
    })
  }

  useEffect(getBookings, [dateInput]);

  const deleteBooking = async timeslotId =>{
    const response = await requestApi(api_url + '/api/modify/timeslot', 'DELETE', {
      timeslotId
    });

    if(!response.success)
      alert('Error, tey again');

    getBookings();
  }

  return (
    <div>
      {/* <Dialog open={addPopup} onClose={closePopup} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add table</DialogTitle>
        <DialogContent>
          <form>
            <TextField autoFocus margin="dense" label="Start" type="number" value={start} onChange={e => setStart(e.target.value)} fullWidth />
            <br /><br />
            <TextField autoFocus margin="dense" label="End" type="number" value={end} onChange={e => setEnd(e.target.value)} fullWidth />
            <br /><br />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup} color="primary">
            Cancel
          </Button>
          <Button type='submit' color="primary" onClick={createtimeSlot}>
            Add
          </Button>
        </DialogActions>
      </Dialog> */}

      <h1>Bokings</h1>
      
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker value={dateInput} onChange={setDateInput} label='Start' />
      </MuiPickersUtilsProvider>
      <Button onClick={getBookings}><Refresh /></Button>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Number of persons</TableCell>
              <TableCell>Tables</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Time Slot</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map(booking => (
              <TableRow key={booking._id}>
                <TableCell>{booking.noOfPersons}</TableCell>
                <TableCell>{booking.tables.map(t => t.tableIdentifier).join(", ") }</TableCell>
                <TableCell>{booking.time}</TableCell>
                <TableCell>{booking.timeslotLiteral}</TableCell>
                <TableCell>{booking.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Fab color="primary" className={classes.floatingButton} aria-label="add" 
      disabled
      >
        <Add />
      </Fab>
    </div>
  )
}

export default Bookings;