import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { checkAuth } from '../../Queries';

export default function PrivateRoute() {
  // When authorized property of invalid is false, let user through
  // If it is true, user needs to reauth
  let authorized: { invalid: boolean } = { invalid: false };
  async function authorize() {
    authorized = await Promise.resolve(checkAuth());
  }
  authorize();
  // if auth is not invalid, redirect to home page, otherwise render respective route element
  return !authorized.invalid ? <Outlet /> : <Navigate to="/" />;
}
