import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logOutUser } from '../../Queries';
import Admin from '../Admin/Admin';
import {
  Avatar,
  Modal,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';

export default function NavBar(props: { refetch?: any }) {
  const navigate = useNavigate();
  const [adminModal, handleAdminModal] = useState(false);
  const handleLogOut = async (): Promise<void> => {
    const res = await logOutUser();
    if (!res.data.valid) navigate('/');
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div id="navbar-container">
      <a onClick={() => navigate('/home')}>
        <img className="homeicon" src="../../../../public/Images/v4.svg" />
      </a>
      <a id="navbar-title">VaaS</a>

      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{ backgroundColor: '#181A1D', marginRight: '10px' }}
        >
          <Avatar
            sx={{ width: 45, height: 45 }}
            src="../../../../public/Images/prof.png"
          ></Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            backgroundColor: '#181A1D',
            width: '200px',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px #2704FF)',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              backgroundColor: '#2704FF',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            handleAdminModal(true);
          }}
          className="logoutMenuButton"
          sx={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          &#9784; SETTINGS
        </MenuItem>
        <MenuItem
          sx={{ fontFamily: 'Montserrat, sans-serif' }}
          onClick={handleLogOut}
          className="logoutMenuButton"
        >
          &#10148; LOGOUT
        </MenuItem>
      </Menu>
      <Modal
        open={adminModal}
        onClose={() => {
          handleAdminModal(false);
        }}
      >
        <div>
          <Admin refetch={props.refetch} handleAdminModal={handleAdminModal} />
        </div>
      </Modal>
    </div>
  );
}
