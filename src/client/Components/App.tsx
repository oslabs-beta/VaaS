import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Login from './Login/Login'
import Home from './Home/Home'
import Register from './Login/Register'
import Settings from './Settings/Settings'
import Visualizer from './Visualizer/Visualizer'
import { useSelector } from 'react-redux';
import { IReducers } from '../Interfaces/IReducers';
// import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@mui/material';
import { Get } from '../Services';
import { apiRoute } from '../utils';

const App = () => {
  const [currentPath, setCurrentPath] = useState('/')
  const navigate = useNavigate();
  const location = useLocation();
  const navBarReducer = useSelector((state: IReducers) => state.navBarReducer);

  useEffect(()=>{
    if(!localStorage.getItem('token')) navigate('/');
    if(localStorage.getItem('token') && navBarReducer.title === 'Home') navigate('/home');
    // if(currentPath !== location.pathname && localStorage.getItem('token')) {
    //   Get(apiRoute.getRoute('auth'), { authorization: localStorage.getItem('token') })
    //     .then(res => {
    //       if(res.invalid) {
    //         localStorage.removeItem('token');
    //         localStorage.removeItem('username');
    //         navigate('/');
    //       }
    //     })
    //     .catch(err => console.log(err))
    // }
    // setCurrentPath(location.pathname)
    // console.log(location.pathname)
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path ="/settings" element={<Settings />} />
      <Route path ="/visualizer" element={<Visualizer />} />
    </Routes>
  );
}

export default App;
