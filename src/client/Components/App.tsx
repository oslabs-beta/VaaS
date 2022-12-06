import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';
import Register from './Login/Register';
import Admin from './Admin/Admin';
import Module from './Cards/Module';
import PrivateRoute from '../Components/Login/PrivateRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="/admin" element={<PrivateRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/module" element={<PrivateRoute />}>
          <Route path="/module" element={<Module />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
