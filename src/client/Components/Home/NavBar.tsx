import e from 'express';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { signIn } from '../../Store/actions';

const NavBar = () => {
  const [pageName, setPageName] = useState('Home')
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    dispatch(signIn({
      signInState: false,
      username: ''
    }));
    navigate('/');
  }

  const dropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageName(e.target.value)
    navigate('/' + e.target.value.toLowerCase())
  }

  return (
    <div id='navbar'>
      <span>{pageName}</span>
      <button className="btn" id='logout-btn' onClick={handleLogOut}>Logout</button>
      <select id='dropdown' defaultValue='test' onChange={dropdown}>
        <option value='test' disabled hidden>Dropdown</option>
        <option value='Home'>Home</option>
        <option value='Settings'>Settings</option>
      </select>
    </div>
  )
}

export default NavBar;