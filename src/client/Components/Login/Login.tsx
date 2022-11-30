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
// import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { useDispatch } from 'react-redux';
import githubIcon from '../Modules/icons/github-icon.png';
import googleIcon from '../Modules/icons/google-icon.png';
import LoginBackGround from '../../../../public/images/LoginBackGround.png';

const Login = () => {
  const [usernameErr, setUsernameErr] = useState('Username');
  const [passwordErr, setPasswordErr] = useState('Password');
  const dispatch = useAppDispatch();
  const clusterReducer = useAppSelector(
    (state: IReducers) => state.clusterReducer
  );
  const navigate = useNavigate();
  const gDispatch = useDispatch();

  useEffect(() => {
    //sign in state might need to be removed - because we are working with persistent state
    //might be that we use redux-persist in conjunction with local.storage as oppose to actually touching local storage
    console.log('render state from clusterReducer: ', clusterReducer.render);
  }, [clusterReducer]);

  // useEffect(() => {
  //   function start() {
  //     gapi.client.init({
  //       clientId: GClientId,
  //       scope: "email",
  //     });
  //   }
  //   gapi.load("client:auth2", start);
  // }, []);

  // useEffect(() => {
  //   const code = window.location.href.match(/\?code=(.*)/);
  //   if (code) {
  //     console.log("CODE FROM GITHUB IS: ", code[1]);
  //     const gitCode = { code: code[1] };
  //     gitSignin(gitCode);
  //     console.log("BACKEND REQUEST SENT");
  //   }
  // make backend post request and attach code;

  // if response is okay, navigate to home
  // });

  async function gitSignin(body: any) {
    const res = await Post(apiRoute.getRoute('/github'), body).catch((err) =>
      console.log(err)
    );
    console.log('DONE? ');
    console.log(res);

    if (res.token) {
      localStorage.setItem('username', res.name);
      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', res.userId);
      dispatch(setTitle('Home'));
      navigate('/home');
    } else {
      throw new Error('Request unsuccessful');
    }
  }
  const handleLogin = async (): Promise<void> => {
    try {
      console.log('Clicked');
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

      if (res.token) {
        localStorage.setItem('username', body.username);
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

  const googleSuccess = async (gRes: any) => {
    const result = gRes?.profileObj;
    const token = gRes?.tokenId;

    try {
      gDispatch({ type: 'AUTH', data: { result, token } });
      const body = {
        firstName: gRes.profileObj.givenName,
        lastName: gRes.profileObj.familyName,
        username: gRes.profileObj.email,
        password: gRes.profileObj.googleId,
      };
      const check: boolean = await Post(apiRoute.getRoute('gcheck'), body);
      if (check === true) {
        const res = await Put(apiRoute.getRoute('auth'), body).catch((err) =>
          console.log(err)
        );
        if (res.token) {
          localStorage.setItem('username', body.username);
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', res.userId);
        }
      } else {
        const res = await Post(apiRoute.getRoute('auth'), body).catch((err) =>
          console.log(err)
        );
        if (res.token) {
          localStorage.setItem('username', body.username);
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', res.userId);
        }
      }
      navigate('/home');
    } catch (error) {
      console.log(error);
    }
  };

  const googleFailure = (error: any) => {
    console.log('Google Login failure', error);
  };

  const handleGit = () => {
    window.location.replace(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT}&scope=user`
    );
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
          {/* <GoogleLogin
              clientId={GClientId}
              render={(renderProps) => (
                <Button
                  className='gBtn'
                  color='primary'
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  variant="contained"
                  
                  sx={{
                    color: 'white', 
                    backgroundColor: '#3a4a5b', 
                    borderColor: 'white',
                  }}
                ><img src={googleIcon} height='18px'></img>
                  &nbsp;&nbsp;Google Sign In
                </Button>
              )}
              onSuccess={googleSuccess}
              onFailure={googleFailure}
              cookiePolicy="single_host_origin"
          /> */}
          <Button
            variant="contained"
            sx={{
              color: 'white',
              backgroundColor: '#3a4a5b',
              borderColor: 'white',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={handleGit}
          >
            <img src={githubIcon} height="18px"></img>
            &nbsp;&nbsp;Github Sign in
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
