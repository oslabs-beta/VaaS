import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Container, Button, TextField, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { registerUser } from '../../Queries';
// import { LoadingButton } from '@mui/lab';
import LoadingButton from '@mui/lab/LoadingButton';

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
    <div className="container">
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
            label="First Name"
            name="firstName"
            value={fields.firstName}
            type="string"
            variant="standard"
            margin="dense"
            onKeyDown={handleEnterKeyDown}
            onChange={(e) => handleChange(e)}
            fullWidth={true}
            sx={{
              input: { color: '#fff' },
              label: { color: '#fff' },
              borderBottom: '1px solid #fff',
            }}
          />
          <TextField
            id="lastName-input"
            label="Last Name"
            name="lastName"
            value={fields.lastName}
            type="string"
            size="small"
            variant="standard"
            margin="dense"
            onKeyDown={handleEnterKeyDown}
            onChange={(e) => handleChange(e)}
            fullWidth={true}
            sx={{
              input: { color: '#fff' },
              label: { color: '#fff' },
              borderBottom: '1px solid #fff',
            }}
          />
          <TextField
            id="register-username-input"
            label="Username"
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
            sx={{
              input: { color: '#fff' },
              label: { color: '#fff' },
              borderBottom: '1px solid #fff',
            }}
          />
          <TextField
            id="register-password-input"
            label="Password"
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
              onClick={handleSignUp}
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
              Sign Up
            </LoadingButton>
            <Button
              className="btn1"
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
          </Container>
        </Container>
      </Container>
    </div>
  );
};

export default Register;
