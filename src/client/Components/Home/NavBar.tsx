import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Toolbar, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { IReducers } from '../../Interfaces/IReducers';
import { setRender } from '../../Store/actions';

export default function NavBar() {
  const navigate = useNavigate();
  const clusterReducer = useAppSelector((state: IReducers) => state.clusterReducer);
  const dispatch = useAppDispatch();
  const routeHome = () => {
    navigate('/home');
  };

  const routeAdmin = () => {
    navigate('/admin');
  };

  const handleLogOut = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const user: any = null;

  return (
    <div id='navbar'>
      <div className="title noselect">
        VaaS
      </div>
      {/* <Toolbar>
        {user ? (
          <div className='profile'>
            <Avatar alt={user.result.name} src={user.result.imageUrl}>{user.result.name.charAt(0)}</Avatar>
            <Typography className='userName' variant='h6'>{user.result.name}</Typography>
            <Button variant='contained' className='gLogout' color='secondary'>Logout</Button>
          </div>
        ) : (
          <Button variant='contained' className='gLogout' color='secondary'>Sign In with Google</Button>
        )}
      </Toolbar> */}
      <Button
        id="basic-button"
        onClick={handleLogOut}
        variant="text"
        sx={{
          color: "#3a4a5b"
        }}
      >
        <LogoutIcon />
      </Button>
      <Button
        id="basic-button"
        onClick={routeHome}
        variant="text"
        sx={{
          color: "#3a4a5b"
        }}
      >
        <HomeIcon />
      </Button>
      <Button
        id="basic-button"
        onClick={() => dispatch(setRender(!clusterReducer.render))}
        variant="text"
        sx={{
          color: "#3a4a5b"
        }}
      >
        <RefreshIcon />
      </Button>
      <Button
        id="basic-button"
        onClick={routeAdmin}
        variant="text"
        sx={{
          color: "#3a4a5b"
        }}
      >
        <SettingsIcon />
      </Button>
    </div>
  );
}
