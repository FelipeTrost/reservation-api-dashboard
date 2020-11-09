import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {api_url} from '../config';
import { Table, TableCell, TableRow, TableContainer, TableHead, TableBody, Fab, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from '@material-ui/core';
import { Create, Delete, Add } from '@material-ui/icons';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  head: {
      backgroundColor: "#3f51b5",
      color: theme.palette.common.white,
  },
  body: {
      fontSize: 14,
  },
}))(TableCell);

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

const TimeSlots = ({ setTitle }) => {
  const classes = useStyles();

  const [addPopup, setAddPopup] = useState(false);

  const [timeSlots, setTimeSlots] = useState([]);
  const {requestApi} = useAuth();

  // Form input
  const [timeslotId, setTimeslotId] = useState('');

  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  
  const getTimeSlots = async () => {
    const response = await requestApi(api_url + "/api/modify/timeslot", "GET")
      
    if(response.response)
      setTimeSlots(response.response);
    else
      alert('Something went wrong');
  }

  useEffect(() => {
    getTimeSlots();
    setTitle("TimeSlots");
  }, []);

  const closePopup = () => {
    setAddPopup(false);

    setStart(new Date());
    setEnd(new Date());
  }

  const createtimeSlot = async () =>{
    const response = await requestApi(api_url + '/api/modify/timeslot', timeslotId ? 'PUT':'POST', {
      timeslotId,
      start: start.getHours() * 100 + start.getMinutes(),
      end: end.getHours() * 100 + end.getMinutes()
    });
    console.log(response);
    if(response.success){
      setAddPopup(false);
      setTimeslotId('');
      getTimeSlots();
    }else
      alert('Error, try again');
  }

  const populateForm = timeslot => {
    setTimeslotId(timeslot._id);

    const startLiteral = timeslot.start.toString()
    const startDate = new Date();
    startDate.setMinutes(startLiteral.substr(2));
    startDate.setHours(startLiteral.substr(0,2));
    setStart(startDate);

    const endLiteral = timeslot.end.toString()
    const endDate = new Date();
    endDate.setMinutes(endLiteral.substr(2));
    endDate.setHours(endLiteral.substr(0,2));
    setEnd(endDate);

    setAddPopup(true);
  }

  const deleteTable = async timeslotId =>{
    const response = await requestApi(api_url + '/api/modify/timeslot', 'DELETE', {
      timeslotId
    });

    if(!response.success)
      alert('Error, tey again');

    getTimeSlots();
  }

  return (
    <div>
      <Dialog open={addPopup} onClose={closePopup} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Time Slot</DialogTitle>
        <DialogContent>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker value={start} onChange={setStart} label='Start' />
              <br /><br />
              <KeyboardTimePicker value={end} onChange={setEnd}label='End' />
            </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup} color="primary">
            Cancel
          </Button>
          <Button type='submit' color="primary" onClick={createtimeSlot}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Start</StyledTableCell>
              <StyledTableCell colSpan={3}>End</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map(timeslot => (
              <StyledTableRow key={timeslot._id}>
                <TableCell>{timeslot.start}</TableCell>
                <TableCell>{timeslot.end}</TableCell>
                <TableCell>
                  <Button onClick={() => populateForm(timeslot) }>
                    <Create />
                  </Button>
                </TableCell>
                
                <TableCell>
                  <Button onClick={() => deleteTable(timeslot._id)}>
                    <Delete />
                  </Button>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Fab color="primary" className={classes.floatingButton} aria-label="add" 
        onClick={() => setAddPopup(true)}
      >
        <Add />
      </Fab>
    </div>
  )
}

export default TimeSlots;