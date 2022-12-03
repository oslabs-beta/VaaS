import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../Queries';
import { checkAuth } from '../../utils';
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
          marginTop: '4em',
        }}
        className="backdrop"
      >
        <CssBaseline />
        <Container
          id="login-container-container"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
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
            fullWidth={true}
            sx={{
              input: { color: '#fff' },
              label: { color: '#fff' },
              borderBottom: '1px solid #fff',
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
            fullWidth={true}
            sx={{
              input: { color: '#fff' },
              label: { color: '#fff' },
              borderBottom: '1px solid #fff',
            }}
          />
          <Container
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
                ':disabled': { backgroundColor: 'gray', color: '#000' },
                margin: '1rem',
                color: '#fff',
                width: '100%',
                gap: '.5em',
                padding: '.1em',
                height: '2.5rem',
              }}
            >
              Login
            </LoadingButton>
            <Button
              className="btn"
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
              }}
            >
              Register
            </Button>
          </Container>
          <Container
            id="oauth-buttons-container"
            sx={{
              display: 'flex',
              width: '30vw',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              sx={{
                color: 'white',
                backgroundColor: '#3a4a5b',
                borderColor: 'white',
                marginTop: '8px',
                minWidth: '165px',
                height: '3.5em',
                margin: '.5em',
                textAlign: 'center',
              }}
            >
              &nbsp;&nbsp;Google Sign in
            </Button>
            <Button
              variant="contained"
              sx={{
                color: 'white',
                backgroundColor: '#3a4a5b',
                borderColor: 'white',
                marginTop: '8px',
                minWidth: '165px',
                height: '3.5em',
                margin: '.5em',
                textAlign: 'center',
              }}
            >
              &nbsp;&nbsp;Github Sign in
            </Button>
          </Container>
        </Container>
      </Container>
    </div>
  );
};

export default Login;
