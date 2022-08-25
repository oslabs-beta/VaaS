import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { apiRoute } from '../../utils';
import { Post } from '../../Services/index';
import { Container, Button, TextField } from '@mui/material';

const Register = () => {
  const [registered, setRegistered] = useState('');
  const [firstNameErr, setFirstNameErr] = useState('');
  const [lastNameErr, setLastNameErr] = useState('');
  const [usernameErr, setUsernameErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (): Promise<void> => {
    try {
      const body = {
        firstName: (document.getElementById('firstName-input') as HTMLInputElement).value,
        lastName: (document.getElementById('lastName-input') as HTMLInputElement).value,
        username: (document.getElementById('register-username-input') as HTMLInputElement).value,
        password: (document.getElementById('register-password-input') as HTMLInputElement).value,
      };
      const res = await Post(apiRoute.getRoute('auth'), body).catch(err => console.log(err));
      console.log(res);
      if(!body.firstName) setFirstNameErr(' please enter first name');
      else setFirstNameErr('');
      if(!body.lastName) setLastNameErr(' please enter last name');
      else setLastNameErr('');
      if(!body.username) setUsernameErr(' please enter username');
      else setUsernameErr('');
      if(!body.password) setPasswordErr(' please enter password');
      else setPasswordErr('');
      
      if(res.exists) setRegistered('user already exists');
      else if (!body.firstName || !body.lastName || !body.username || !body.password) setRegistered('');
      else {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', body.username);
        navigate('/home');
      }
    } catch (err) {
      console.log('Post failed');
    }
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if(e.key === 'Enter') handleSignUp();
  };

  return (
    <Container sx={{
      height: '100vh',
      minWidth: '100%',
      justifyContent: 'center',
      display: 'flex',
      direction: 'column',
      textAlign: 'center',
      alignItems: 'center',
      backgroundSize: 'contain',
      bgColor: '#3a4a5b',
      
    }} className='backdrop'>
       <Container maxWidth='sm' className='login-container' 
       sx = {{
          bgcolor: 'rgb(255,255,255)',
          height: '50%',
          width: '50%',
          opacity: '95%',
          direction: 'column',
          textAlign: 'center',
          alignItems: 'center',
          // display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundRepeat: 'no-repeat',
       }}>
      <div>
        <h1>Register</h1>
      </div>
      <div>
          </div>
            <TextField
              id='firstName-input'
              label='First Name'
              type='string'
              size='small'
              variant='outlined'
              margin="dense"
              onSubmit={handleEnterKeyDown}
            />
            <span className='input-error-text'>{usernameErr}</span>
          <div>
          </div>
            <TextField
              id='lastName-input'
              label='Last Name'
              type='string'
              size='small'
              variant='outlined'
              margin="dense"
              onSubmit={handleEnterKeyDown}
            />
            <span className='input-error-text'>{usernameErr}</span>
          <div>
          </div>
            <TextField
              id='login-username-input'
              label='Username'
              type='username'
              size='small'
              autoComplete='current-username'
              variant='outlined'
              onSubmit={handleEnterKeyDown}
              margin="dense"
            />
            <span className='input-error-text'>{usernameErr}</span>
          <div>
            <TextField
              id='login-password-input'
              label='Password'
              type='password'
              size='small'
              autoComplete='current-password'
              variant='outlined'
              margin="dense"
              onKeyDown={handleEnterKeyDown}
            />
          
            <span className='input-error-text'>{passwordErr}</span>
          </div>

      {/* <Link to='/'>Go back</Link> */}
        <Container id = 'buttonContainer' sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: '.5em',
          padding: '.5em',
        }}>
          <Button 
            variant='contained' 
            onClick = {() => navigate('/')}
          > Go Back
          </Button>
            
          <Button 
            variant='contained'
            onClick={handleSignUp} 
            type='button'
          > Sign Up</Button>
        <p className='input-error-text'>{registered}</p>
        </Container>
      </Container>
    </Container>
  );
};

export default Register;
