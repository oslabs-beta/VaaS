import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import Login from "./Login/Login";
import Home from "./Home/Home";
import Register from "./Login/Register";
import Admin from "./Admin/Admin";
import Module from "./Cards/Module";
import { Get } from "../Services";
import { apiRoute } from "../utils";
import { setTitle } from "../Store/actions";
import {theme, darkMode} from './ITheme'; 
import { createTheme, ThemeProvider } from "@mui/material";
const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (
      !localStorage.getItem("token") &&
      location.pathname !== "/" &&
      location.pathname !== "/register"
    ) {
      navigate("/");
    }
    if (localStorage.getItem("token")) {
      const verified = async () => {
        try {
          const res = await Get(
            apiRoute.getRoute("auth"), 
            {
              authorization: localStorage.getItem("token"),
            });
          if (res.invalid) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            navigate("/");
          }
          // if auth is not invalid and we are on login page or register => redirect to home page
          if (
            !res.invalid &&
            (location.pathname === "/" || location.pathname === "/register")
          ) {
            navigate("/home");
          }
        } catch (err) {
          console.log(err);
        }
      };
      verified();
    }
    dispatch(
      setTitle(location.pathname.replace("/", "").toUpperCase())
    );
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/module" element={<Module />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
