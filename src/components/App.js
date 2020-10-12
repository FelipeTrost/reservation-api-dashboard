import React from 'react';
import {BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthProvider } from '../contexts/AuthContext'
import PrivateRoute from './PriveteRoute';

import { Container } from '@material-ui/core';

import Tables from './Tables';
import Login from './Login';
import TimeSlots from './TimeSlots';
import Bookings from './Bookings';
import Nav from './Nav';

const App = () => {
  return (
    <Container>
      <Router>
        <AuthProvider>
          <Nav />
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/tables" component={Tables} />
            <PrivateRoute exact path="/timeslots" component={TimeSlots} />
            <PrivateRoute exact path="/bookings" component={Bookings} />
            <PrivateRoute path="/" component={() => <p>Starting page</p>} />
          </Switch>
        </AuthProvider>
      </Router>
    </Container>
  )
}

export default App;
