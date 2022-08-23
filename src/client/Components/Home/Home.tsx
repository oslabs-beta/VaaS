import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { IReducers } from '../../Interfaces/IReducers';
import NavBar from './NavBar'
import UserWelcome from './UserWelcome';
import Cluster from '../Cards/Cluster';
import './styles.css'

const Home = () => {
  const userReducer = useSelector((state: IReducers) => state.userReducer);

  useEffect(() => {
    console.log('signInState from store:', userReducer.signInState)
    console.log('Signed in username from localStorage:', localStorage.getItem('username'))
    console.log('JWT token stored from localStorage:', localStorage.getItem('token'));
  }, [userReducer]);

  return (
    <div>
      <NavBar />
      <UserWelcome />
      <Cluster />
    </div>
  )
}

export default Home;