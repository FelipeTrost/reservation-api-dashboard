import React, { useState } from 'react';
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
  const [title, setTitle] = useState("Home");

  return (
    <Router>
      <AuthProvider>
        <Nav title={title} />
        <Container>
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/tables" component={() => <Tables setTitle={setTitle} />} />
            <PrivateRoute exact path="/timeslots" component={() => <TimeSlots setTitle={setTitle} />} />
            <PrivateRoute exact path="/bookings" component={() => <Bookings setTitle={setTitle} />} />
            <PrivateRoute path="/" component={() => {
              setTitle("Home");
              return <p>Starting page</p>;
            }} />
          </Switch>
        </Container>
      </AuthProvider>
    </Router>
  )
}

export default App;
