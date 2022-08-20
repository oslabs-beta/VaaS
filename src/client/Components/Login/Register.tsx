import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { apiRoute } from '../../utils';
import { Get, Post, Put, Delete } from '../../Services/index';

const Register = () => {
  const [registered, setRegistered] = useState('')
  const navigate = useNavigate();
  const handleSignUp = async (): Promise<void> => {
    try {
      const body = {
        firstName: (document.getElementById('firstname-input') as HTMLInputElement).value,
        lastName: (document.getElementById('lastname-input') as HTMLInputElement).value,
        username: (document.getElementById('register-username-input') as HTMLInputElement).value,
        password: (document.getElementById('register-password-input') as HTMLInputElement).value,
      }
      const res = await Post(apiRoute.getRoute('auth'), body).catch(err => console.log(err));
      console.log(res);
      if(res.exists) setRegistered('user already exists')
      else if (res.message) setRegistered('invalid inputs')
      else navigate('/')
    } catch (err) {
      console.log('Post failed');
    }
    // alert('REGISTERED')
  }

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if(e.key === 'Enter') handleSignUp();
  }

  return (
    <div className="register-container">
      <div>
        <h1>Vaas</h1>
      </div>
      <div>
        <div>
          <Link to='/'>Go back</Link>
        </div>
        <span>First Name:</span>
        <input id="firstname-input" onKeyDown={handleEnterKeyDown}/>
      </div>
      <div>
        <span>Last Name:</span>
        <input id="lastname-input" onKeyDown={handleEnterKeyDown}/>
      </div>
      <div>
        <span>Username:</span>
        <input id="register-username-input" onKeyDown={handleEnterKeyDown}/>
      </div>
      <div>
        <span>Password:</span>
        <input id="register-password-input" type="password" onKeyDown={handleEnterKeyDown}/>
      </div>
      <button onClick={handleSignUp} type="button">Sign Up</button>
      <p>{registered}</p>
    </div>
  )
}

export default Register;