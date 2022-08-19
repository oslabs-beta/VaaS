import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { apiRoute } from '../../utils';
import { Get, Post, Put, Delete } from '../../Services/index';

const Register = () => {
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
    } catch (err) {
      console.log('Post failed');
    }
    // alert('REGISTERED')
  }

  return (
    <div className="register-container">
      <div>
        <h1>Vaas</h1>
      </div>
      <div>
        <span>First Name:</span>
        <input id="firstname-input" />
      </div>
      <div>
        <span>Last Name:</span>
        <input id="lastname-input" />
      </div>
      <div>
        <span>Username:</span>
        <input id="register-username-input" />
      </div>
      <div>
        <span>Password:</span>
        <input id="register-password-input" type="password" />
      </div>
      <button onClick={handleSignUp} type="button">Sign Up</button>
    </div>
  )
}

export default Register;