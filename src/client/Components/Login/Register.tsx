import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { apiRoute } from '../../utils';
import { Post } from '../../Services/index';
import { Container, Button, TextField, Typography } from '@mui/material';

const Register = () => {
  // potential redux?
  const [registered, setRegistered] = useState('');
  const [firstNameErr, setFirstNameErr] = useState('First Name');
  const [lastNameErr, setLastNameErr] = useState('Last Name');
  const [usernameErr, setUsernameErr] = useState('Username');
  const [passwordErr, setPasswordErr] = useState('Password');
  const navigate = useNavigate();

  const handleSignUp = async (): Promise<void> => {
    try {
      const body = {
        firstName: (
          document.getElementById('firstName-input') as HTMLInputElement
        ).value,
        lastName: (
          document.getElementById('lastName-input') as HTMLInputElement
        ).value,
        username: (
          document.getElementById('register-username-input') as HTMLInputElement
        ).value,
        password: (
          document.getElementById('register-password-input') as HTMLInputElement
        ).value,
      };

      const res = await Post(apiRoute.getRoute('auth'), body).catch((err) =>
        console.log(err)
      );

      if (!body.firstName) setFirstNameErr(' please enter first name');
      else setFirstNameErr('First Name');

      if (!body.lastName) setLastNameErr(' please enter last name');
      else setLastNameErr('Last Name');

      if (!body.username) setUsernameErr(' please enter username');
      else setUsernameErr('Username');

      if (!body.password) setPasswordErr(' please enter password');
      else setPasswordErr('Password');

      if (res.exists) {
        setRegistered('user already exists');
      } else if (
        !body.firstName ||
        !body.lastName ||
        !body.username ||
        !body.password
      ) {
        setRegistered('');
      } else {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', body.username);
        localStorage.setItem('userId', res.userId);
        navigate('/home');
      }
    } catch (err) {
      console.log('Post failed', err);
    }
  };

  const handleEnterKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') handleSignUp();
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
          </div>
          <TextField
            id="firstName-input"
            label={firstNameErr}
            type="string"
            variant="standard"
            margin="dense"
            onKeyDown={handleEnterKeyDown}
            fullWidth={true}
          />
          <TextField
            id="lastName-input"
            label={lastNameErr}
            type="string"
            size="small"
            variant="standard"
            margin="dense"
            onKeyDown={handleEnterKeyDown}
            fullWidth={true}
          />
          <TextField
            id="register-username-input"
            label={usernameErr}
            type="username"
            size="small"
            autoComplete="current-username"
            variant="standard"
            onKeyDown={handleEnterKeyDown}
            margin="dense"
            fullWidth={true}
          />
          <TextField
            id="register-password-input"
            label={passwordErr}
            type="password"
            size="small"
            autoComplete="current-password"
            variant="standard"
            margin="dense"
            onKeyDown={handleEnterKeyDown}
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
          <div>
            <p className="input-error-text">{registered}</p>
          </div>
        </Container>
      </Container>
    </div>
  );
};

export default Register;
