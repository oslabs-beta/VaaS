import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { IReducers } from '../../Interfaces/IReducers';
import { signIn } from '../../Store/actions';
import './styles.css'

const Home = () => {
  const appReducer = useSelector((state: IReducers) => state.appReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('signInState: ', appReducer.signInState)
    console.log('Signed in username: ', appReducer.username)
    console.log('JWT token stored in localStorage: ', localStorage.getItem('token'));
  }, [appReducer]);

  const handleLogOut = (): void => {
    dispatch(signIn({
      signInState: false,
      username: ''
    }));
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div>
      <div><span>NavBar placeholder</span><button className="btn" id='logout-btn'onClick={handleLogOut}>Logout</button></div>
      This is the home page.
      <div>{appReducer.username}</div>
    </div>
  )
}

export default Home;