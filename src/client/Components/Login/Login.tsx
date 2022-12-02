import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../Queries';
import { checkAuth } from '../../utils';
import { Container, Box, Button, TextField, CssBaseline } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import './styles.css';
import LoginBackGround from '../../../../public/images/LoginBackGround.png';

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
            {error && <span style={{ color: 'red' }}>{error}</span>}
          </div>
          <TextField
            id="login-username-input"
            label="Username"
            type="username"
            autoComplete="current-username"
            size="small"
            margin="dense"
            name="username"
            value={fields.username}
            onKeyDown={handleEnterKeyDown}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            id="login-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            size="small"
            margin="dense"
            name="password"
            value={fields.password}
            onKeyDown={handleEnterKeyDown}
            onChange={(e) => handleChange(e)}
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
            {/* login button */}
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
            {/* register button */}
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
