import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { IReducers } from '../../Interfaces/IReducers';
import { apiRoute } from '../../utils';
import { setTitle, signIn } from '../../Store/actions';
import { Put } from '../../Services/index';
import './styles.css';
import { Container, Box, Button, TextField } from '@mui/material';



const Login = () => {
  const [usernameErr, setUsernameErr] = useState('Username');
  const [passwordErr, setPasswordErr] = useState('Password');
  const dispatch = useDispatch();
  const userReducer = useSelector((state: IReducers) => state.userReducer);
  const navigate = useNavigate();

  useEffect(() => {
    //sign in state might need to be removed - because we are working with persistent state 
    //might be that we use redux-persist in conjunction with local.storage as oppose to actually touching local storage
    console.log('signInState from store: ', userReducer.signInState);
    console.log('Signed in username from store: ', userReducer.username);
  }, [userReducer]);

  const handleLogin = async (): Promise<void> => {
    try {
      const body = {
        username: (document.getElementById('login-username-input') as HTMLInputElement).value,
        password: (document.getElementById('login-password-input') as HTMLInputElement).value
      };
      const res = await Put(apiRoute.getRoute('auth'), body).catch(err => console.log(err));
      //use a hook to fire off action(type: signIn, res)
      console.log(res);
      if (!body.username) setUsernameErr(' please enter username');
      else setUsernameErr('Username');
      if (!body.password) setPasswordErr(' please enter password');
      else setPasswordErr('Password');
      if (res.token) {
        localStorage.setItem('username', body.username);
        dispatch(signIn({
          signInState: true,
          username: body.username
        }));
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId);
        dispatch(setTitle('Home'));
        navigate('/home');
      }
      if (res.invalid) {
        setUsernameErr(res.message);
        setPasswordErr('');
      }
    } catch (err) {
      console.log('Get failed');
    }
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Container sx={{
      bgcolor: '#77c6ef',
      height: '100vh',
      justifyContent: 'center',
      display: 'flex',
      direction: 'column',
      textAlign: 'center',
      alignItems: 'center',
    }} className="backdrop">
      <Box
        maxWidth="sm" 
        className="login-container"
        sx={{
          bgcolor: '#e8a322',
          width: '50%',
        }}
        >
        <div>
          <h1>VaaS</h1>
        </div>
        <div>
        </div>
          <TextField
          id="login-username-input"
          label={usernameErr}
          type="username"
          autoComplete="current-password"
          variant="filled"
          onKeyDown={handleEnterKeyDown}
        />
        <div>
          <TextField
          id="login-password-input"
          label={passwordErr}
          type="password"
          autoComplete="current-password"
          variant="filled"
          onKeyDown={handleEnterKeyDown}
        />
        </div>
        <Button variant="contained" className="btn" type="button" onClick={handleLogin}>Login</Button>
        <Button variant="contained" className="btn" type="button" onClick={() => navigate('/register')}>Register</Button>
      </Box>
    </Container>
  );
};

export default Login;
