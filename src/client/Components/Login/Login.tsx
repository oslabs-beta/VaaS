import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, checkAuth } from '../../Queries';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';
import {
  Container,
  Box,
  Button,
  TextField,
  CssBaseline,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import './styles.css';

const Login = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const disabled = !fields.username || !fields.password;

  useEffect(() => {
    console.log('Fire Authorize Use Effect');
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
    <div className="container" id="login-container">
      <Box
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
        <img id="login-icon" src="../../../../public/Images/v4.svg" />
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
      </Box>
      <Box
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
            autoComplete="current-password"
            variant="standard"
            size="small"
            onKeyDown={handleEnterKeyDown}
            onChange={handleChange}
            margin="dense"
            name="username"
            value={fields.username}
            sx={{
              input: { color: '#fff' },
              label: { color: '#fff' },
              borderBottom: '1px solid #fff',
              backgroundColor: 'transparent',
              borderRadius: '10px',
              padding: '10px 20px',
              width: '50%',
            }}
          />
          <TextField
            id="login-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="standard"
            size="small"
            onKeyDown={handleEnterKeyDown}
            onChange={handleChange}
            margin="dense"
            name="password"
            value={fields.password}
            sx={{
              input: { color: '#fff' },
              label: { color: '#fff' },
              borderBottom: '1px solid #fff',
              backgroundColor: 'transparent',
              borderRadius: '10px',
              padding: '10px 20px',
              width: '50%',
            }}
          />
          <Box
            id="buttonContainer"
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
            <LoadingButton
              className="btn"
              type="button"
              onClick={handleLogin}
              variant="contained"
              disabled={disabled}
              loading={loading}
              sx={{
                ':disabled': {
                  backgroundColor: 'gray',
                  color: 'black',
                  border: '1px solid black',
                },
                ':enabled': {
                  backgroundColor: 'blue',
                  color: 'white',
                  border: '1px solid black',
                },
                margin: '1rem',
                width: '100%',
                gap: '.5em',
                padding: '.1em',
                height: '2.5rem',
                maxWidth: '60%',
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
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '.5em',
                padding: '.1em',
                width: '100%',
                height: '2.5rem',
                backgroundColor: '#2704ff',
                border: '1px solid black',
                maxWidth: '60%',
              }}
            >
              Register
            </Button>
          </Box>
          <Box
            id="oauth-buttons-container"
            sx={{
              display: 'flex',
              width: '12vw',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              sx={{
                color: 'white',
                backgroundColor: '#2704ff',
                borderColor: 'white',
                marginTop: '8px',
                minWidth: '165px',
                height: '3.5em',
                margin: '.5em',
                textAlign: 'center',
                border: '1px solid black',
              }}
            >
              <FcGoogle className="icon" />
              &nbsp;&nbsp;Sign in
            </Button>
            <Button
              variant="contained"
              sx={{
                color: 'white',
                backgroundColor: '#2704ff',
                borderColor: 'white',
                marginTop: '8px',
                minWidth: '165px',
                height: '3.5em',
                margin: '.5em',
                textAlign: 'center',
                border: '1px solid black',
              }}
            >
              <BsGithub className="icon" />
              &nbsp;&nbsp;Sign in
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Login;
