import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { IReducers } from '../../Interfaces/IReducers';
import NavBar from './NavBar'
import Cluster from '../Cards/Cluster';
import './styles.css'


const Home = () => {
  const userReducer = useSelector((state: IReducers) => state.userReducer);

  useEffect(() => {
    console.log('signInState from store: ', userReducer.signInState)
    console.log('Signed in username from localStorage: ', localStorage.getItem('username'))
    console.log('JWT token stored from localStorage: ', localStorage.getItem('token'));
  }, [userReducer]);

  return (
    <div>
      <NavBar />
      <Cluster />
    </div>
  )
}

export default Home;