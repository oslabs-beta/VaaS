import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Login from './Login/Login';
import Home from './Home/Home';
import Register from './Login/Register';
import Admin from './Admin/Admin';
import AddCluster from './AddCluster/AddCluster';
import { Get } from '../Services';
import { apiRoute } from '../utils';
import { useDispatch } from 'react-redux';
import { setTitle } from '../Store/actions';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(()=>{
    if(!localStorage.getItem('token') && location.pathname !== '/' && location.pathname !== '/register') navigate('/');
    if(localStorage.getItem('token')) {
      const verified = async () => {
        try{
          const res = await Get(apiRoute.getRoute('auth'), { authorization: localStorage.getItem('token') });
          if(res.invalid) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            navigate('/');
          }
          if(!res.invalid && (location.pathname === '/' || location.pathname === '/register')) navigate('/home');
        } catch (err) {
          console.log(err);
        }
      };
      verified();
    }
    dispatch(setTitle(location.pathname.replace('/', '').toUpperCase()));
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path ="/admin" element={<Admin />} />
      <Route path ="/addcluster" element={<AddCluster />} />
    </Routes>
  );
};

export default App;
