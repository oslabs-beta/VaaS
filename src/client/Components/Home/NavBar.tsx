import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IReducers } from '../../Interfaces/IReducers';
import { Get } from '../../Services';

import { setTitle, signIn } from '../../Store/actions';
import { apiRoute } from '../../utils';

const NavBar = () => {
  const navBarReducer = useSelector((state: IReducers) => state.navBarReducer)
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

  const dropdown = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    // try {
    //   const res = await Get(apiRoute.getRoute('auth'), { authorization: localStorage.getItem('token') })
    //     .catch(err => console.log(err));
    //   console.log(res)
    //   if (res.invalid) {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('username');
    //     navigate('/')
    //   } else {
    //     dispatch(setTitle(e.target.value));
    //     navigate('/' + e.target.value.toLowerCase());
    //   }
    // } catch (err) {
    //   console.log('Get failed err: ', err)
    // }
    dispatch(setTitle(e.target.value));
    navigate('/' + e.target.value.toLowerCase());
  }

  return (
    <div id='navbar'>
      <span>{navBarReducer.title}</span>
      <button className='btn' id='logout-btn' onClick={handleLogOut}>Logout</button>
      <select id='dropdown' defaultValue='test' onChange={dropdown}>
        <option value='test' disabled hidden>Dropdown</option>
        <option value='Home'>Home</option>
        <option value='Settings'>Settings</option>
        <option value='Visualizer'>Visualizer</option>
      </select>
      <span id='username-navbar'>{'Username: ' + localStorage.getItem('username')}</span>
    </div>
  )
}

export default NavBar;
