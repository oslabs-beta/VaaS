import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Login from './Login/Login';
import Home from './Home/Home';
import Register from './Login/Register';
import Admin from './Admin/Admin';
import Module from './Cards/Module';
import PrivateRoute from '../Components/Login/PrivateRoute';
import { Get } from '../Services';
import { apiRoute } from '../utils';
import { setTitle } from '../Store/actions';

const App = () => {
  // useEffect(() => {
  //   // if (location.pathname !== "/" && location.pathname !== "/register") {
  //   //   navigate("/");
  //   // }
  //     const verified = async () => {
  //       try {
  //         const res = await Get(apiRoute.getRoute("auth"));
  //         console.log(res, 'consolin resssss')
  //         if (res.invalid) navigate("/");
  //         // if auth is not invalid and we are on login page or register => redirect to home page
  //         if (!res.invalid && (location.pathname === "/" || location.pathname === "/register")) {
  //           navigate("/home");
  //         }
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     };
  //     verified();
  //   dispatch(setTitle(location.pathname.replace("/", "").toUpperCase()));
  // }, [location]);
  console.log('going to login');
  return (
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
      {/* <PrivateRoute path="/module" element={<Module />} /> */}
    </Routes>
  );
};

export default App;
