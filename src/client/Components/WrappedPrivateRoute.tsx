import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home/Home';
import Module from './Cards/Module';
import PrivateRoute from '../Components/Login/PrivateRoute';
import { ProSidebarProvider } from 'react-pro-sidebar';
import FailedSidebar from './Home/FailedSidebar'; // THIS IS GONE

const WrappedPrivateRoute = () => {
  return (
    <ProSidebarProvider>
      {/* <MenuSidebar /> */}
      <Routes>
        <Route path="cluster" element={<PrivateRoute />}>
          <Route path="cluster" element={<Home />} />
        </Route>
        <Route path="module" element={<PrivateRoute />}>
          <Route path="module" element={<Module />} />
        </Route>
      </Routes>
    </ProSidebarProvider>
  );
};

export default WrappedPrivateRoute;
