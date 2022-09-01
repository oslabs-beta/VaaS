import React from 'react';
import { useNavigate } from 'react-router-dom';


import { Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

export default function NavBar() {
  const navigate = useNavigate();
  
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
