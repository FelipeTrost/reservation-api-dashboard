import React, { useState } from 'react';

import { useHistory } from "react-router-dom"
import { TextField, Card, Button, CardContent } from '@material-ui/core/';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../contexts/AuthContext';

const useStyles = makeStyles({
    root: {
      maxWidth: 400,
      margin: "20px auto",
      padding: 20,
    },
    down:{
        marginBottom: 20
    },
    block:{
        display: "block",
        marginTop: 40
    },
    top:{
        marginTop: 40
    },
});

const Login = () => {
    const {login} = useAuth();
    const classes = useStyles();
    const history = useHistory()

    const [errorLogin, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        
        const username = e.target.username.value;
        const password = e.target.password.value;

        if(await login(username, password)){
            history.push('/');
        }else{
            setError(true);
            setTimeout(() => setError(false), 5000);
        }
        setLoading(false);
    }

    return (
      <Card className={classes.root}>
        <CardContent>
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
                <TextField className={classes.down} id="standard-basic" name="username" label="Username" />
                <TextField id="standard-basic" label="Password" name="password" type="password" />
                <Button color="primary" variant="contained" className={classes.block} type="submit" disabled={loading}>
                    Login
                </Button>
            </form>

            {errorLogin && (
                <Alert severity="error" className={classes.top}>Oops! Something went wrong, try again</Alert>
            )}

        </CardContent>
  </Card>
  );
}

export default Login;