import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { checkAuth } from '../../Queries';
// import { setTitle } from '../../Store/actions';

export default function PrivateRoute() {
  let authorized: { invalid: boolean } = { invalid: false };
  async function authorize() {
    authorized = await Promise.resolve(checkAuth());
  }
  authorize();
  // dispatch(setTitle(location.pathname.replace('/', '').toUpperCase()));
  // if auth is not invalid, redirect to home page, otherwise render respective route element
  return !authorized.invalid ? <Outlet /> : <Navigate to="/" />;
}
