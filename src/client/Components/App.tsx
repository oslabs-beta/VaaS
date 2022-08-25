import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Login from './Login/Login';
import Home from './Home/Home';
import Register from './Login/Register';
import Settings from './Settings/Settings';
import Visualizer from './Visualizer/Visualizer';
import { Get } from '../Services';
import { apiRoute } from '../utils';
import { useDispatch } from 'react-redux';
import { setTitle } from '../Store/actions';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(()=>{
    if(!localStorage.getItem('token') && location.pathname !== '/' && location.pathname !== '/register') navigate('/');
    dispatch(setTitle(location.pathname.replace('/', '').toUpperCase()));
    if(localStorage.getItem('token')) {
      Get(apiRoute.getRoute('auth'), { authorization: localStorage.getItem('token') })
        .then(res => {
          if(res.invalid) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            navigate('/');
          }
        })
        .catch(err => console.log(err));
    }
    
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path ="/settings" element={<Settings />} />
      <Route path ="/visualizer" element={<Visualizer />} />
    </Routes>
  );
};

export default App;
