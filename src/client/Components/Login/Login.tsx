import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import {
  apiRoute,
  GITHUB_CLIENT_ID,
  GITHUB_REDIRECT,
  GClientId,
} from '../../utils';
import { setTitle } from '../../Store/actions';
import { Put, Post } from '../../Services/index';
import { IReducers } from '../../Interfaces/IReducers';
import { Container, Box, Button, TextField, CssBaseline } from '@mui/material';
import './styles.css';
import { useDispatch } from 'react-redux';
import LoginBackGround from '../../../../public/images/LoginBackGround.png';

const Login = () => {
  const [usernameErr, setUsernameErr] = useState('Username');
  const [passwordErr, setPasswordErr] = useState('Password');
  const dispatch = useAppDispatch();
  const clusterReducer = useAppSelector(
    (state: IReducers) => state.clusterReducer
  );
  const navigate = useNavigate();

  useEffect(() => {
    //sign in state might need to be removed - because we are working with persistent state
    //might be that we use redux-persist in conjunction with local.storage as oppose to actually touching local storage
    console.log('render state from clusterReducer: ', clusterReducer.render);
  }, [clusterReducer]);

  const handleLogin = async (): Promise<void> => {
    try {
      const body = {
        username: (
          document.getElementById('login-username-input') as HTMLInputElement
        ).value,
        password: (
          document.getElementById('login-password-input') as HTMLInputElement
        ).value,
      };
      // put request returns token and userId
      const res = await Put(apiRoute.getRoute('auth'), body).catch((err) =>
        console.log(err)
      );

      if (!body.username) setUsernameErr(' please enter username');
      else setUsernameErr('Username');

      if (!body.password) setPasswordErr(' please enter password');
      else setPasswordErr('Password');
      console.log(res, 'res on login');
      if (res.userId) {
        dispatch(setTitle('Home'));
        navigate('/home');
      }
      if (res.invalid) {
        setUsernameErr(res.message);
        setPasswordErr('');
      }
    } catch (err) {
      console.log('Get failed', err);
    }
  };

  // when click on enter key, invoke login func
  const handleEnterKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') {
      console.log('Enter key pressed');
      handleLogin();
    }
  };

  return (
    <div>
      <Container
        sx={{
          height: '100vh',
          minWidth: '100%',
          justifyContent: 'center',
          display: 'flex',
          direction: 'column',
          textAlign: 'center',
          alignItems: 'center',
          backgroundImage: `url(${LoginBackGround})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
        className="backdrop"
      >
        <CssBaseline />
        <Box
          maxWidth="sm"
          className="login-container"
          sx={{
            width: '40%',
            minWidth: '250px',
            opacity: '95%',
            direction: 'column',
            textAlign: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '1.5rem',
            borderRadius: '2%',
          }}
        >
          <div>
            <h1>VaaS</h1>
          </div>
          <TextField
            id="login-username-input"
            label={usernameErr}
            type="username"
            autoComplete="current-password"
            variant="outlined"
            size="small"
            onKeyDown={handleEnterKeyDown}
            margin="dense"
          />
          <TextField
            id="login-password-input"
            label={passwordErr}
            type="password"
            autoComplete="current-password"
            variant="outlined"
            size="small"
            onKeyDown={handleEnterKeyDown}
            margin="dense"
          />
          <Container
            id="buttonContainer"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '.5em',
              padding: '.5em',
            }}
          >
            <Button
              className="btn"
              type="button"
              onClick={handleLogin}
              variant="contained"
              sx={{
                color: 'white',
                backgroundColor: '#3a4a5b',
                borderColor: 'white',
              }}
            >
              Login
            </Button>

            <Button
              className="btn"
              type="button"
              onClick={() => navigate('/register')}
              variant="contained"
              sx={{
                color: 'white',
                backgroundColor: '#3a4a5b',
                borderColor: 'white',
              }}
            >
              Register
            </Button>
          </Container>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
