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

const Bookings = ({ setTitle }) => {
  const classes = useStyles();

  // const [addPopup, setAddPopup] = useState(false);

  const [tables, setTables] = useState([]);
  const {requestApi} = useAuth();
  const [dateInput, setDateInput] = useState(new Date());

  const getBookings = async () => {
    const year = dateInput.getFullYear();
    const month = dateInput.getMonth() + 1;
    const day = dateInput.getDate();

    
    const response = await requestApi(api_url + "/api/modify/bookingcomplete", "GET", {
        year,
        month,
        day
      })
      
    if(response.success && response.response){
      console.log(response.response);
      setTables(response.response);
    }else{
      alert("Error fetching information")
    }
  }

  useEffect(() => {
    getBookings();
    setTitle("Bookings");
  }, [dateInput]);

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
      
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker value={dateInput} onChange={setDateInput} label='Start' />
      </MuiPickersUtilsProvider>
      <Button onClick={getBookings}><Refresh /></Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Table</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Bookings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tables.map(table => (
              <TableRow key={table._id}>
                <TableCell>{table.tableIdentifier}</TableCell>
                <TableCell>{table.capacity}</TableCell>
                <TableCell>
                  {table.bookings.map(booking => (
                    <TableContainer key={booking._id}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Number of persons</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Time Slot</TableCell>
                            <TableCell>Email</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={booking._id}>
                              <TableCell>{booking.noOfPersons}</TableCell>
                              <TableCell>{booking.time}</TableCell>
                              <TableCell>{booking.timeslotLiteral}</TableCell>
                              <TableCell>{booking.email}</TableCell>
                            </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>))}
                </TableCell>
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