import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './Login/Login';
import Home from './Home/Home';
import Register from './Login/Register';
import Module from './Cards/Module';
import PrivateRoute from '../Components/Login/PrivateRoute';
import { ProSidebarProvider } from 'react-pro-sidebar';
import WrappedPrivateRoute from './WrappedPrivateRoute';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<WrappedPrivateRoute />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
