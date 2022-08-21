import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { apiRoute } from '../utils';
import { AppStates, AppProps } from '../Interfaces/IApp';
import { Get, Post, Put, Delete } from '../Services/index';
import Login from './Login/Login'
import Home from './Home/Home'
import Register from './Login/Register'
import Settings from './Settings/Settings'
import { useSelector } from 'react-redux';
import { IReducers } from '../Interfaces/IReducers';

const App = () => {
  const navigate = useNavigate();
  const navBarReducer = useSelector((state: IReducers) => state.navBarReducer);

  useEffect(()=>{
    if(!localStorage.getItem('token')) navigate('/');
    if(localStorage.getItem('token') && navBarReducer.title === 'Home') navigate('/home');
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path ="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;