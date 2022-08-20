import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { IReducers } from '../../Interfaces/IReducers';
import './styles.css'
import NavBar from './NavBar'

const Home = () => {
  const appReducer = useSelector((state: IReducers) => state.appReducer);
  const navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem('token')) navigate('/');
    console.log('signInState from store: ', appReducer.signInState)
    console.log('Signed in username from localStorage: ', localStorage.getItem('username'))
    console.log('JWT token stored from localStorage: ', localStorage.getItem('token'));
  }, [appReducer]);

  return (
    <div>
      <NavBar />
      This is the home page.
      <div>{'username: ' + localStorage.getItem('username')}</div>
    </div>
  )
}

export default Home;