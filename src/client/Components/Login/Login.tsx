import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, checkAuth } from '../../Queries';
// import { FcGoogle } from 'react-icons/fc';
// import { BsGithub } from 'react-icons/bs';
// import { Box, Button, TextField, CssBaseline, Typography } from '@mui/material';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import './styles.css';
import { LoginTypes } from '../../../client/Interfaces';

const Login = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<LoginTypes>({
    username: '',
    password: '',
  });
  // * VaaS 4.0 error wasn't used, but the error handling is updated to use setError instead of disabled variable
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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
  }, [navigate]);

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
    } catch (error) {
      console.log('Error: ', error);
      setError('There was an error logging in');
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
    <div className="loginPage">
      <div className="container" id="login-container">
        <Box
          id="login-logo-container"
          sx={{
            // height: '30vh',
            // marginTop: '8vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <img
            alt="login icon"
            className="login-icon"
            height="200px"
            src="Images/image1.png"
          />
          <Typography
            // sx={{
            //   fontSize: '2.5rem',
            //   marginTop: '0',
            //   marginBottom: '2vh',
            //   paddingTop: '0',
            //   letterSpacing: '0.3rem',
            //   color: '#fff',
            //   cursor: 'default',
            // }}
            className="vaas-text"
          >
            VaaS
          </Typography>
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
              // margin="dense"
              name="username"
              value={fields.username}
              // sx={{
              //   input: { color: '#fff' },
              //   label: { color: '#fff' },
              //   borderBottom: '1px solid #fff',
              //   backgroundColor: 'transparent',
              //   borderRadius: '10px',
              //   padding: '10px 20px',
              //   width: '50%',
              // }}
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
              // sx={{
              //   input: { color: '#fff' },
              //   label: { color: '#fff' },
              //   borderBottom: '1px solid #fff',
              //   backgroundColor: 'transparent',
              //   borderRadius: '10px',
              //   padding: '10px 20px',
              //   width: '50%',
              // }}
            />
            <Box
              id="buttonContainer"
              sx={{
                width: '100%',
                // minWidth: '250px',
                // maxWidth: '600px',
                // direction: 'column',
                // textAlign: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingBottom: '0.5rem',
                // padding: '1.5rem',
                // border: '0px solid #eaeaea',
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
                  backgroundColor: '#19b780',
                  color: '#F5F5F5',
                  border: '1px solid black',
                  // },
                  margin: '0.5rem 0rem 0.6rem 0rem',
                  // fontWeight: 'bold',
                  fontFamily: 'Rubik, Verdana, Arial, sans-serif',
                  fontSize: '1em',
                  width: '390px',
                  gap: '.6em',
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
                  // fontWeight: 'bold',
                  width: '390px',
                  gap: '.5em',
                  color: '#F5F5F5',
                  // padding: '.1em',
                  height: '2.3rem',
                  fontFamily: 'Rubik, Verdana, Arial, sans-serif',
                  fontSize: '1em',
                  backgroundColor: '#02a4f7',
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
    </div>
  );
};

export default Login;
