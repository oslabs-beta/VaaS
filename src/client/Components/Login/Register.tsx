import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRoute } from '../../utils';
import { Post } from '../../Services/index';
import { Container, Button, TextField, Typography } from '@mui/material';
import { registerUser } from '../../Queries';
import { LoadingButton } from '@mui/lab';

const Register = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const disabled =
    !fields.firstName ||
    !fields.lastName ||
    !fields.username ||
    !fields.password;

  const handleSignUp = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await registerUser({ ...fields });
      if (response.data.userId) navigate('/home');
      setLoading(false);
    } catch (error: any) {
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError('');
    const {
      target: { name, value },
    } = e;
    setFields({ ...fields, [name]: value });
  };

  // when click on enter key, invoke signup func
  const handleEnterKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') {
      if (disabled) return;
      handleSignUp();
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
            fontWeight: 'bold',
            marginTop: '0',
            marginBottom: '2vh',
            paddingTop: '0',
            letterSpacing: '0.2rem',
          }}
        >
          VaaS
        </Typography>
      </Container>
      <Container
        sx={{
          minWidth: '100%',
          justifyContent: 'center',
          display: 'flex',
          direction: 'column',
          textAlign: 'center',
          alignItems: 'center',
          backgroundSize: 'contain',
          bgColor: '#3a4a5b',
        }}
        className="backdrop"
      >
        <Container
          className="login-container"
          sx={{
            display: 'flex',
            width: '100%',
            minWidth: '250px',
            maxWidth: '600px',
            direction: 'column',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '1.5rem',
            border: '0px solid #eaeaea',
          }}
        >
          <div>
            <h2>Registration</h2>
            {error && <span style={{ color: 'red' }}>{error}</span>}
          </div>
          <TextField
            id="firstName-input"
            label="firstName"
            name="firstName"
            value={fields.firstName}
            type="string"
            variant="standard"
            margin="dense"
            onKeyDown={handleEnterKeyDown}
            onChange={(e) => handleChange(e)}
            fullWidth={true}
          />
          <TextField
            id="lastName-input"
            label="lastName"
            name="lastName"
            value={fields.lastName}
            type="string"
            size="small"
            variant="standard"
            margin="dense"
            onKeyDown={handleEnterKeyDown}
            onChange={(e) => handleChange(e)}
            fullWidth={true}
          />
          <TextField
            id="register-username-input"
            label="username"
            type="username"
            name="username"
            value={fields.username}
            size="small"
            autoComplete="current-username"
            variant="standard"
            onKeyDown={handleEnterKeyDown}
            onChange={(e) => handleChange(e)}
            margin="dense"
            fullWidth={true}
          />
          <TextField
            id="register-password-input"
            label="password"
            type="password"
            name="password"
            value={fields.password}
            size="small"
            autoComplete="current-password"
            variant="standard"
            margin="dense"
            onKeyDown={handleEnterKeyDown}
            onChange={(e) => handleChange(e)}
            fullWidth={true}
          />
          <Container
            id="buttonContainer"
            sx={{
              marginTop: '2rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '2em',
              padding: '.5em',
            }}
          >
            <LoadingButton
              onClick={handleSignUp}
              variant="contained"
              type="button"
              disabled={disabled}
              loading={loading}
            ></LoadingButton>
            <Button
              onClick={() => navigate('/')}
              variant="contained"
              sx={{
                width: '100%',
                height: '3em',
                color: 'white',
                backgroundColor: '#3a4a5b',
                borderColor: 'white',
              }}
            >
              Go Back
            </Button>
            <Button
              onClick={handleSignUp}
              variant="contained"
              sx={{
                width: '100%',
                height: '3em',
                color: 'white',
                backgroundColor: '#3a4a5b',
                borderColor: 'white',
              }}
              type="button"
            >
              Sign Up
            </Button>
          </Container>
        </Container>
      </Container>
    </div>
  );
};

export default Register;
