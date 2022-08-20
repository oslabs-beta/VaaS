import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { apiRoute } from '../utils';
import { AppStates, AppProps } from '../Interfaces/IApp';
import { Get, Post, Put, Delete } from '../Services/index';
import Login from './Login/Login'
import Home from './Home/Home'
import Register from './Login/Register'
import Settings from './Home/Settings'

const App = () => {
  const navigate = useNavigate();
  
  useEffect(()=>{
    if(!localStorage.getItem('token')) navigate('/');
  },[])

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