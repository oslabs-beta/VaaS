import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home/Home';
import Module from './Cards/Module';
import PrivateRoute from '../Components/Login/PrivateRoute';
import { ProSidebarProvider } from 'react-pro-sidebar';
import MenuSidebar from './Home/MenuSidebar';

const WrappedPrivateRoute = () => {
  return (
    <div>
      <ProSidebarProvider>
        <Routes>
          <Route path="/home" element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
          <Route path="/module" element={<PrivateRoute />}>
            <Route path="/module" element={<Module />} />
          </Route>
        </Routes>
      </ProSidebarProvider>
    </div>
  );
};

export default WrappedPrivateRoute;
