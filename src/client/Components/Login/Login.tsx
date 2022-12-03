import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from 'src/client/Queries';
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
          <div>
            <h1>VaaS</h1>
          </div>
          <TextField
            id="login-username-input"
            label="Username"
            type="username"
            autoComplete="current-password"
            variant="outlined"
            size="small"
            onKeyDown={handleEnterKeyDown}
            margin="dense"
            name="username"
            value={fields.username}
          />
          <TextField
            id="login-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            size="small"
            onKeyDown={handleEnterKeyDown}
            margin="dense"
            name="password"
            value={fields.password}
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
              sx={{
                color: 'white',
                backgroundColor: '#3a4a5b',
                borderColor: 'white',
              }}
              disabled={disabled}
              loading={loading}
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
              }}
            >
              Register
            </Button>
          </Container>
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
          >
            &nbsp;&nbsp;Github Sign in
          </Button>
        </Container>
      </Container>
    </div>
  );
};

export default Login;
