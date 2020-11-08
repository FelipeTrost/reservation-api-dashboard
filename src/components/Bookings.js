import React, { Fragment, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {api_url} from '../config';
import { Table, TableCell, TableRow, TableContainer, TableHead, TableBody, Fab, Button } from '@material-ui/core';
import { Add, Refresh } from '@material-ui/icons';
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

  const [tables, setTables] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
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
      setTables(response.response.tables);
      setTimeSlots(response.response.timeSlots);
    }else{
      alert("Error fetching information")
    }
  }

  useEffect(() => {getBookings()}, [dateInput]);
  

  return (
    <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker value={dateInput} onChange={setDateInput} label='Start' />
        </MuiPickersUtilsProvider>

        <Button onClick={getBookings}><Refresh /></Button>

        <TableContainer>
            <Table style={{marginTop: 30}}>
                <TableHead>
                    <TableRow>
                        <TableCell style={{borderRight: "1px #e0e0e0 solid"}}>Table</TableCell>
                        {timeSlots.map((ts, i) => (<>
                            <TableCell key={i} colSpan={3} align="center" style={{borderRight: i !== timeSlots.length - 1 && "1px #e0e0e0 solid"}}>
                                { `${ts.start}-${ts.end}` }
                            </TableCell>
                        </>))}
                    </TableRow>
                    <TableRow>
                    <TableCell style={{borderRight: "1px #e0e0e0 solid"}}></TableCell>
                        {timeSlots.map((_, i) => (
                            <Fragment key={i}>
                                    <TableCell size="small">Zeit</TableCell>
                                    <TableCell size="small">Personen</TableCell>
                                    <TableCell size="small" style={{borderRight: i !== timeSlots.length - 1 && "1px #e0e0e0 solid"}}>Name</TableCell>
                            </Fragment>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {tables.map((table, i) => (
                        <TableRow key={i}>
                            <TableCell style={{borderRight: "1px #e0e0e0 solid"}}>
                                {table.tableIdentifier}
                            </TableCell>
                            {timeSlots.map((ts, idx) => (
                                <Fragment key={idx}>                                    
                                    <TableCell>
                                        {(table.orderedBookings[ts._id] && table.orderedBookings[ts._id].time) || ""}
                                    </TableCell>
                                    <TableCell>
                                        {(table.orderedBookings[ts._id] && table.orderedBookings[ts._id].noOfPersons) || ""}
                                    </TableCell>
                                    <TableCell style={{borderRight: idx !== timeSlots.length - 1 && "1px #e0e0e0 solid"}}>
                                        {(table.orderedBookings[ts._id] && table.orderedBookings[ts._id].email) || ""}
                                    </TableCell>
                                </Fragment>
                            ))}
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