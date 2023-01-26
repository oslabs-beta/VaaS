import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './Login/Login';
import Home from './Home/Home';
import Register from './Login/Register';
import Module from './Cards/Module';
import PrivateRoute from '../Components/Login/PrivateRoute';
import AddClusters from './AddCluster/AddCluster';

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
        <Route path="/module" element={<PrivateRoute />}>
          <Route path="/module" element={<Module />} />
        </Route>
        {/* <Route path="/addCluster" element={<PrivateRoute />}>
          <Route path="/addCluster" element={<AddClusters  refetch={'cash'}  handleAddClusters={AddClusters} />} />
        </Route> */}
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
