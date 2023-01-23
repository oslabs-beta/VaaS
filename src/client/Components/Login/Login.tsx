import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, checkAuth } from '../../Queries';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';
// import { Box, Button, TextField, CssBaseline, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import TextField, { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
// import { InputProps } from '@mui/material';

// import { LoadingButton } from '@mui/lab';
import LoadingButton from '@mui/lab/LoadingButton';
import './styles.css';

const Login = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ username: '', password: '' });
  // * VaaS 4.0 error wasn't used, but the error handling is updated to use setError instead of disabled variable
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // * VaaS 4.0 removed the disabled feature because it doesn't allow you to login in with autofilled credentials
  //// const disabled = !fields.username || !fields.password;

  // We don't want users who have a cookie to go through the login process -> check for their cookie and if they have a valid one, let them in
  //passing in array as second argument allows authorize function to only run once
  useEffect(() => {
    const authorize = async () => {
      const authorized = await checkAuth();
      if (!authorized.invalid) navigate('/home');
    };
    authorize();
  }, []);

  // Handler Functions
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // * resetting error to an empty string
    setError('');
    const {
      target: { name, value },
    } = e;
    setFields({ ...fields, [name]: value });
  };

  const handleLogin = async (): Promise<void> => {
    // * updated handleLogin to check if inputs are empty to prevent a fetch call
    // * with invalid credentails
    // * this replaces the disabled feature
    if (fields.username === '' || fields.password === '')
      return setError('Invalid username or password');
    setLoading(true);
    try {
      const response = await loginUser({ ...fields });
      if (response.data.userId) {
        setError('');
        navigate('/home');
      } else {
        //* VaaS 4.0 message below will appear to notify user of invalid login credentials
        setError('Invalid username or password');
        return setLoading(false);
      }
    } catch (error: any) {
      setError(error.response.data.message);
      setLoading(false);
    }
  };
  // when click on enter key, invoke login func
  const handleEnterKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    // setError('');
    if (e.key === 'Enter') {
      // if (disabled) return;
      handleLogin();
    }
  };

  return (
    // * VaaS 4.0 moved a lot of the inline styling to the css page
    <div className="container" id="login-container">
      <Box
        id="login-logo-container"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          alt="login icon"
          className="login-icon"
          src="../../../../public/Images/v4.svg"
        />
        <Typography className="vaas-text">VaaS</Typography>
        {error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="nonError"> </div>
        )}
      </Box>
      <Box
        sx={{
          minWidth: '100%',
          justifyContent: 'center',
          display: 'flex',
          direction: 'column',
          textAlign: 'center',
          alignItems: 'center',
          // backgroundSize: 'cover',
          // backgroundRepeat: 'no-repeat',
        }}
        className="backdrop"
      >
        <CssBaseline />
        <Box
          id="login-container-container"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '2rem',
            width: '100%',
          }}
        >
          <TextField
            id="login-username-input"
            label="Username"
            type="username"
            autoComplete="current-username"
            variant="filled"
            size="small"
            onKeyDown={handleEnterKeyDown}
            onChange={handleChange}
            name="username"
            value={fields.username}
          />
          <TextField
            id="login-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="filled"
            size="small"
            onKeyDown={handleEnterKeyDown}
            onChange={handleChange}
            margin="dense"
            name="password"
            value={fields.password}
          />
          <Box
            id="buttonContainer"
            sx={{
              width: '100%',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingBottom: '0.5rem',
              '@media screen and (max-height: 800px)': {
                marginBottom: '2em',
              },
            }}
          >
            <LoadingButton
              className="btn"
              type="button"
              onClick={handleLogin}
              variant="contained"
              // disabled={disabled}
              loading={loading}
              sx={{
                // ':disabled': {
                //   backgroundColor: 'gray',
                //   color: 'rgb(37, 37, 37)',
                //   border: '1px solid black',
                // },
                // ':enabled': {
                backgroundColor: '#2604ffb1',
                color: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid black',
                // },
                margin: '0.5rem 0rem 0.6rem 0rem',
                fontWeight: 'bold',
                width: '390px',
                gap: '.5em',
                // padding: '.1em',
                height: '2.3rem',
                // maxWidth: '60%',

                '@media screen and (max-width: 650px)': {
                  maxWidth: '60vw',
                },
              }}
            >
              Login
            </LoadingButton>
            <Button
              className="btn1"
              type="button"
              onClick={() => navigate('/register')}
              variant="contained"
              sx={{
                fontWeight: 'bold',
                width: '390px',
                gap: '.5em',
                color: 'rgba(255, 255, 255, 0.8)',
                // padding: '.1em',
                height: '2.3rem',
                backgroundColor: '#2604ffb1',
                border: '1px solid black',
                // maxWidth: '60%',
                '@media screen and (max-width: 650px)': {
                  maxWidth: '60vw',
                },
              }}
            >
              Register
            </Button>
          </Box>
          {/*  VaaS 4.0 oauth was not implemented so commenting out buttons until it's added*/}
          {/* <Box
            id="oauth-buttons-container"
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              marginTop: '0px',
              alignItems: 'center',
              '@media screen and (max-width: 650px)': {
                flexDirection: 'column',
              },
            }}
          >
            <Button
              variant="contained"
              className="oauth-btn"
              sx={{
                color: 'white',
                backgroundColor: '#2704ffb1',
                borderColor: 'white',
                marginTop: '8px',
                paddingRight: '30px',
                width: '185px',
                height: '2.5em',
                margin: '8px',
                textAlign: 'center',
                border: '1px solid black',
                fontFamily: 'Arial, Tahoma, Sans-serif',
                '@media screen and (max-width: 650px)': {
                  width: '60vw',
                  marginBottom: '1px',
                  paddingRight: '40px',
                },
              }}
            >
              <FcGoogle className="icon" />
              &nbsp;&nbsp;<span className="oauth-text">Sign in</span>
            </Button>
            <Button
              variant="contained"
              className="oauth-btn"
              sx={{
                color: 'white',
                backgroundColor: '#2704ffb1',
                borderColor: 'white',
                marginTop: '8px',
                paddingRight: '30px',
                width: '185px',
                height: '2.5em',
                margin: '8px',
                textAlign: 'center',
                border: '1px solid black',
                '@media screen and (max-width: 650px)': {
                  width: '60vw',
                  marginBottom: '1px',
                  paddingRight: '40px',
                },
              }}
            >
              <BsGithub className="icon" />
              &nbsp;&nbsp;<span className="oauth-text">Sign in</span>
            </Button>
          </Box> */}
        </Box>
      </Box>
    </div>
  );
};

export default Login;
