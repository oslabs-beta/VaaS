import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { apiRoute } from '../utils';
import { AppStates } from '../Interfaces/IApp';
import { Get, Post, Put, Delete } from '../Services/index';
import { Login } from './Login'
import { Home } from './Home'

export const App = () => {
  const sampleGet = async (): Promise<void> => {
    try {
      const res = await Get(apiRoute.getRoute('sample'));
      console.log(res);
    } catch (err) {
      console.log('Get failed');
    }
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}
