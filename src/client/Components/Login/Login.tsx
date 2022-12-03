import React, { useEffect, useState } from 'react';
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
import { loginUser } from '../../Queries';
import { checkAuth } from '../../utils';
import { LoadingButton } from '@mui/lab';
import {
  Container,
  Box,
  Button,
  TextField,
  CssBaseline,
  Divider,
  Typography,
} from '@mui/material';
import './styles.css';
import { useDispatch } from 'react-redux';
import githubIcon from '../Modules/icons/github-icon.png';
import googleIcon from '../Modules/icons/google-icon.png';
import LoginBackGround from '../../../../public/images/LoginBG.png';
import { borderColor } from '@mui/system';

const Login = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const disabled = !fields.username || !fields.password;

  useEffect(() => {
    const authorize = async () => {
      const authorized = await checkAuth();
      if (!authorized.invalid) navigate('/home');
    };
    authorize();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError('');
    const {
      target: { name, value },
    } = e;
    setFields({ ...fields, [name]: value });
  };

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await loginUser({ ...fields });
      if (response.data.userId) navigate('/home');
      setLoading(false);
    } catch (error: any) {
      setError(error.response.data.message);
      setLoading(false);
    }
  };
  // when click on enter key, invoke login func
  const handleEnterKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') {
      // console.log('Enter key pressed');
      if (disabled) return;
      handleLogin();
    }
  };

  return (
    <div>
      <Container
        id="login-logo-container"
        sx={{
          height: '30vh',
          marginTop: '8vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          id="login-icon"
          src="../../../../public/Images/logo-icon.png"
        ></img>
        <Typography
          sx={{
            fontSize: '2.5rem',
            marginTop: '0',
            marginBottom: '2vh',
            paddingTop: '0',
            letterSpacing: '0.3rem',
            color: '#fff',
          }}
        >
          VaaS
        </Typography>
        {error && <span style={{ color: 'red' }}>{error}</span>}
      </Container>
      <Container
        sx={{
          minWidth: '100%',
          justifyContent: 'center',
          display: 'flex',
          direction: 'column',
          textAlign: 'center',
          alignItems: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
        className="backdrop"
      >
        <CssBaseline />
        <Container
          id="login-container-container"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            maxWidth="sm"
            className="login-container"
            sx={{
              width: '100%',
              minWidth: '250px',
              maxWidth: '600px',
              direction: 'column',
              textAlign: 'center',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '1.5rem',
              border: '0px solid #eaeaea',
            }}
          >
            <TextField
              id="login-username-input"
              label="Username"
              type="username"
              autoComplete="current-username"
              name="username"
              value={fields.username}
              variant="standard"
              onKeyDown={handleEnterKeyDown}
              margin="dense"
              fullWidth={true}
              onChange={(e) => handleChange(e)}
              sx={{
                input: {
                  color: '#fff',
                },
                label: {
                  color: '#fff',
                },
                borderBottom: '1px solid #fff',
              }}
            />
            <TextField
              id="login-password-input"
              label="Password"
              type="password"
              name="password"
              value={fields.password}
              autoComplete="current-password"
              variant="standard"
              onKeyDown={handleEnterKeyDown}
              margin="dense"
              onChange={(e) => handleChange(e)}
              fullWidth={true}
              sx={{
                input: {
                  color: '#fff',
                },
                label: {
                  color: '#fff',
                },
                borderBottom: '1px solid #fff',
              }}
            />
            <Button
              variant="text"
              sx={{
                justifySelf: 'flex-end',
                alignSelf: 'flex-end',
                fontSize: '0.7em',
              }}
            >
              Forgot Password?
            </Button>
            <Container
              id="buttonContainer"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '.5em',
                padding: '.1em',
              }}
            >
              <LoadingButton
                className="btn"
                type="button"
                onClick={handleLogin}
                disabled={disabled}
                loading={loading}
              ></LoadingButton>
              <Button
                className="btn"
                type="button"
                onClick={handleLogin}
                variant="contained"
                sx={{
                  marginTop: '2em',
                  marginBottom: '1em',
                  height: '3em',
                }}
              >
                Log in
              </Button>
              <Divider
                light={true}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                OR
              </Divider>
              <Button
                className="btn"
                type="button"
                onClick={() => navigate('/register')}
                variant="contained"
                sx={{
                  marginTop: '1em',
                  marginBottom: '1em',
                  height: '3em',
                }}
              >
                Register
              </Button>
              <Container
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  margin: '0em',
                  padding: '0em',
                  gap: '2em',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: '4em',
                  }}
                >
                  <img src={githubIcon} height="18px"></img>
                  &nbsp;&nbsp;Google Sign In
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: '4em',
                  }}
                >
                  <img src={githubIcon} height="18px"></img>
                  &nbsp;&nbsp;Github Sign in
                </Button>
              </Container>
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
          </Box>
        </Container>
      </Container>
    </div>
  );
};

export default Login;
