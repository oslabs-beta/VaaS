import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { apiRoute } from '../utils';
import { AppStates, AppProps } from '../Interfaces/IApp';
import { Get, Post, Put, Delete } from '../Services/index';
import Login from './Login/Login'
import Home from './Home'
import Register from './Login/Register'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;