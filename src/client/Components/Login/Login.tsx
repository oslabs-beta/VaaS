import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { IReducers } from '../../Interfaces/IReducers';
import { apiRoute } from '../../utils';
import { setTitle, signIn } from '../../Store/actions';
import { Put } from '../../Services/index';
import './styles.css';
import { Container, Box, Button, TextField } from '@mui/material';
import { doesNotReject } from 'assert';


const Login = () => {
  const [message, setMessage] = useState('');
  const [usernameErr, setUsernameErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
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
      else setUsernameErr('');
      if (!body.password) setPasswordErr(' please enter password');
      else setPasswordErr('');
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
      if (res.invalid) setMessage(res.message);
      else setMessage('');
    } catch (err) {
      console.log('Get failed');
    }
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div>
      <Container sx={{
        height: '100vh',
        minWidth: '100%',
        justifyContent: 'center',
        display: 'flex',
        direction: 'column',
        textAlign: 'center',
        alignItems: 'center',
        backgroundSize: 'contain',
        bgcolor: '#3a4a5b',
        
      }} className="backdrop">
      
        <Box
          maxWidth="sm" 
          className="login-container"
          sx={{
            bgcolor: '#ffffff',
            height: '50%',
            width: '50%',
            opacity: '95%',
            direction: 'column',
            textAlign: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          >
          <div>
            <h1>Login</h1>
          </div>
          <div>
          </div>
            <TextField
              id="login-username-input"
              label="Username"
              type="username"
              autoComplete="current-password"
              variant="outlined"
              size='small'
              onSubmit={handleEnterKeyDown}
              margin="dense"
          />
          <div>
            <TextField
              id="login-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="outlined"
              size='small'
              onKeyDown={handleEnterKeyDown}
              margin="dense"
            />
          
            <span className='input-error-text'>{passwordErr}</span>
          </div>
          <Container id = 'buttonContainer' sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '.5em',
            padding: '.5em',
          }}>
            <Button variant="contained" className="btn" type="button" onClick={handleLogin}>Login</Button>
            <Button variant="contained" className="btn" type="button" onClick={() => navigate('/register')}>Register</Button>
            <p className='input-error-text'>{message}</p>
          </Container>
          
        </Box>
      </Container>
    </div>
  );
};

export default Login;
