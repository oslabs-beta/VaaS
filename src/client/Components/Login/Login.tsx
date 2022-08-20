import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { IReducers } from '../../Interfaces/IReducers';
import { apiRoute } from '../../utils';
import { signIn } from '../../Store/actions'
import { Get, Post, Put, Delete } from '../../Services/index';
import './styles.css';

const Login = () => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const appReducer = useSelector((state: IReducers) => state.appReducer)
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('token')) navigate('/home')
    console.log('signInState: ', appReducer.signInState)
    console.log('Signed in username: ', appReducer.username)
  }, [appReducer]);

  const handleLogin = async (): Promise<void> => {
    try {
      const body = {
        username: (document.getElementById('login-username-input') as HTMLInputElement).value,
        password: (document.getElementById('login-password-input') as HTMLInputElement).value
      }
      const res = await Put(apiRoute.getRoute('auth'), body).catch(err => console.log(err));
      //use a hook to fire off action(type: signIn, res)
      console.log(res)
      if(!body.username || !body.password) setMessage('please enter username and/or password')
      if(res.token) {
        localStorage.setItem('username', body.username);
        dispatch(signIn({
          signInState: true,
          username: localStorage.getItem('username')
        }));
        localStorage.setItem('token', res.token);
        navigate('/home');
      }
      if(res.invalid) setMessage('wrong username/password')
    } catch (err) {
      console.log('Get failed');
    }
  }

  

  return (
    <div className="login-container">
      <div>
        <h1>Vaas</h1>
      </div>
      <div>
        <span>Username:</span>
        <input id="login-username-input" />
      </div>
      <div>
        <span>Password:</span>
        <input id="login-password-input" type="password" />
      </div>
      <button className="btn" type="button" onClick={handleLogin}>Login</button>
      <Link to="/register"><button className="btn" type="button">Register</button></Link>
      <p>{message}</p>
    </div>
  )
}

export default Login;
