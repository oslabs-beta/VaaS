import React, { useState, useEffect } from 'react';
import { LoginStates } from '../Interfaces/ILogin';
import { Link } from 'react-router-dom';

export const Login = ({ welcome }: LoginStates) => {
  const [message, setMessage] = useState(welcome);

  useEffect(() => {
    console.log('You can set state to change welcome message with setMessage')
    setMessage('Welcome to Vaas')
  }, []);

  return (
    <div>{message}
      <div>
        This is the login page.
      </div>
      <Link to="/home"><button className="btn-login" type="button">Login</button></Link>
    </div>
  )
}