import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IReducers } from '../../Interfaces/IReducers';
import { Get } from '../../Services';

import { setTitle } from '../../Store/actions';
import { apiRoute } from '../../utils';
import { Button, MenuItem, Menu } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

export default function NavBar() {
  const navBarReducer = useSelector((state: IReducers) => state.navBarReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navBarOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
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

  return (
    <div id='navbar'>
      <div className="title noselect">VaaS</div>
      <Button
        id="basic-button"
        onClick={handleLogOut}
        sx={{
          color: "#3a4a5b"
        }}
        variant="text"
      >
        <LogoutIcon />
      </Button>
      <Button
        id="basic-button"
        onClick={routeHome}
        sx={{
          color: "#3a4a5b"
        }}
        variant="text"
      >
        <HomeIcon />
      </Button>
      <Button
        id="basic-button"
        onClick={routeAdmin}
        sx={{
          color: "#3a4a5b"
        }}
        variant="text"
      >
        <SettingsIcon />
      </Button>
    </div>
  );
}
