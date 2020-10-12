import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {api_url} from '../config';
import { Table, TableCell, TableRow, TableContainer, TableHead, TableBody, Fab, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { Create, Delete, Add } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

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

const Tables = () => {
  const classes = useStyles();

  const [addPopup, setAddPopup] = useState(false);

  const [tables, setTables] = useState([]);
  const {requestApi} = useAuth();

  // Form input
  const [tableId, setTableId] = useState('');

  const [tableIdentifier, setTableIdentifier] = useState('');
  const [combinable, setCombinable] = useState(true);
  const [available, setAvailable] = useState(true);
  const [capacity, setCapacity] = useState(0);
  const [description, setDescription] = useState('');

  const getTables = () => {
    requestApi(api_url + "/api/modify/table", "GET")
    .then(response => {
      console.log(response);
      if(response.response)
        setTables(response.response);
      else
        alert('Something went wrong');
    })
  }

  useEffect(getTables, []);

  const closePopup = () => {
    setAddPopup(false);

    setTableIdentifier('');
    setCombinable(true);
    setAvailable(true);
    setCapacity(0);
    setDescription('');
  }

  const createTable = async () =>{
    const response = await requestApi(api_url + '/api/modify/table', tableId ? 'PUT':'POST', {
      tableId,
      tableIdentifier,
      combinable,
      available,
      capacity,
      description
    });

    if(response.success){
      setAddPopup(false);
      setTableId('');
      getTables();
    }else
      alert('Error, tey again');
  }

  const populateForm = table => {
    setTableId(table._id);

    setTableIdentifier(table.tableIdentifier);
    setCombinable(table.combinable);
    setAvailable(table.available);
    setCapacity(table.capacity);
    setDescription(table.description);

    setAddPopup(true);
  }

  const deleteTable = async id =>{
    const response = await requestApi(api_url + '/api/modify/table', 'DELETE', {
      tableId: id
    });

    if(!response.success)
      alert('Error, tey again');

    getTables();
  }

  return (
    <div>
      <Dialog open={addPopup} onClose={closePopup} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add table</DialogTitle>
        <DialogContent>
          <form>
            <TextField autoFocus margin="dense" label="Table Identifier" value={tableIdentifier} onChange={e => setTableIdentifier(e.target.value)} fullWidth />
            <br /><br />
            <FormControl>
              <InputLabel>Combinable</InputLabel>
              <Select value={combinable} onChange={e => setCombinable(e.target.value)} name="combinable">
                <MenuItem value={true} >True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </FormControl>
            <br /><br />
            <FormControl>
              <InputLabel>Available</InputLabel>
              <Select value={available} onChange={e => setAvailable(e.target.value)} name="available">
                <MenuItem value={true} >True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </FormControl>
            <br /><br />
            <TextField autoFocus margin="dense" label="Capacity" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} fullWidth />
            <br /><br />
            <TextField autoFocus margin="dense" label="Description" value={description} onChange={e => setDescription(e.target.value)} fullWidth />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup} color="primary">
            Cancel
          </Button>
          <Button type='submit' color="primary" onClick={createTable}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <h1>Tables</h1>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>TableIdentifier</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Combinable</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tables.map(table => (
              <TableRow key={table._id}>
                <TableCell>{table.tableIdentifier}</TableCell>
                <TableCell>{table.capacity}</TableCell>
                <TableCell>{table.combinable ? 'Yes' : 'No'}</TableCell>
                <TableCell>{table.available ? 'Yes' : 'No'}</TableCell>
                <TableCell>{table.description || 'None'}</TableCell>
                <TableCell>
                  <Button onClick={() => populateForm(table) }>
                    <Create />
                  </Button>
                </TableCell>
                
                <TableCell>
                  <Button onClick={() => deleteTable(table._id)}>
                    <Delete />
                  </Button>
                </TableCell>
              </TableRow>
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

export default Tables;