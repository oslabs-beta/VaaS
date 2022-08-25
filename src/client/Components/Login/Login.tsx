import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { IReducers } from '../../Interfaces/IReducers';
import { apiRoute } from '../../utils';
import { setTitle, signIn } from '../../Store/actions';
import { Put } from '../../Services/index';
import './styles.css';
import { Container, Button } from '@mui/material';


const Login = () => {
  const [message, setMessage] = useState('');
  const [usernameErr, setUsernameErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const dispatch = useDispatch();
  const userReducer = useSelector((state: IReducers) => state.userReducer);
  const navigate = useNavigate();

  useEffect(() => {
    //sign in state might need to be removed - because we are working with persistent state 
    //might be that we use redux-persist in conjunction with local.storage as oppose to actually touching local storage
    console.log('signInState from store: ', userReducer.signInState);
    console.log('Signed in username from store: ', userReducer.username);
  }, [userReducer]);

  const handleLogin = async (): Promise<void> => {
    try {
      const body = {
        username: (document.getElementById('login-username-input') as HTMLInputElement).value,
        password: (document.getElementById('login-password-input') as HTMLInputElement).value
      };
      const res = await Put(apiRoute.getRoute('auth'), body).catch(err => console.log(err));
      //use a hook to fire off action(type: signIn, res)
      console.log(res);
      if (!body.username) setUsernameErr(' please enter username');
      else setUsernameErr('');
      if (!body.password) setPasswordErr(' please enter password');
      else setPasswordErr('');
      if (res.token) {
        localStorage.setItem('username', body.username);
        dispatch(signIn({
          signInState: true,
          username: body.username
        }));
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId);
        dispatch(setTitle('Home'));
        navigate('/home');
      }
      if (res.invalid) setMessage(res.message);
      else setMessage('');
    } catch (err) {
      console.log('Get failed');
    }
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Container sx={{
      bgcolor: '#cfe8fc',
      height: '100vh',
      justifyContent: 'center',
      direction: 'column',
      textAlign: 'center',
      alignItems: 'center',
    }} className="backdrop">
      <Container maxWidth="sm" className="login-container">
        <div>
          <h1>VaaS</h1>
        </div>
        <div>
          <span>Username:</span>
          <input id="login-username-input" onSubmit={handleEnterKeyDown} />
          <span className='input-error-text'>{usernameErr}</span>
        </div>
        <div>
          <span>Password:</span>
          <input id="login-password-input" type="password" onKeyDown={handleEnterKeyDown} />
          <span className='input-error-text'>{passwordErr}</span>
        </div>
        <Button variant="contained" className="btn" type="button" onClick={handleLogin}>Login</Button>
        <Button variant="contained" className="btn" type="button" onClick={() => navigate('/register')}>Register</Button>
        <p className='input-error-text'>{message}</p>
      </Container>
    </Container>
  );
};

export default Login;
