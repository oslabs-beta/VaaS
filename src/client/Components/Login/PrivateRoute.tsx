import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Get } from '../../Services';
import { apiRoute } from '../../utils';
// import { setTitle } from '../../Store/actions';

export default function PrivateRoute() {
  console.log('hit private route');
  let authorized: { invalid: boolean } = { invalid: false };
  async function authorize() {
    authorized = await Get(apiRoute.getRoute('auth'));
  }
  authorize();
  // dispatch(setTitle(location.pathname.replace('/', '').toUpperCase()));
  // if auth is not invalid, redirect to home page
  console.log(authorized, 'authorized');
  return !authorized.invalid ? <Outlet /> : <Navigate to="/" />;
}
