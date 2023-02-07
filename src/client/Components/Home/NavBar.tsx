import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logOutUser } from '../../Queries';
import Admin from '../Admin/Admin';
import Avatar from '@mui/material/Avatar';
import Modal from '@mui/material/Modal';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
// import AddClusters from '../Admin/AddCluster';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';

export default function NavBar(props: { refetch?: any; open: any }) {
  const navigate = useNavigate();
  const [adminModal, handleAdminModal] = useState(false);
  const handleLogOut = async (): Promise<void> => {
    const res = await logOutUser();
    if (!res.data.valid) navigate('/');
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [light, setLight] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setLight(true);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setLight(false);
  };
  return (
    <div id="navbar-container">
      {/* <a onClick={() => navigate('/home')}> */}
      {/* <img
          className="homeicon"
          src="Images/image1.png"
          width="60px"
          alt="home icon"
        /> */}
      <MenuIcon
        sx={{
          color: '#f5f5f5',
          '&:hover': { color: '#0f9595', cursor: 'pointer' },
        }}
        fontSize="large"
        onClick={props.open}
      />
      {/* </a> */}
      {/* <img alt="logo" id="navbar-title" src="Images/logoText.png" /> */}
      <button id="navbar-title" onClick={() => navigate('/home')}>
        VaaS
      </button>

      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          id="icon-button"
        >
          <Avatar
            sx={{ width: '55px', height: '55px' }}
            onMouseEnter={() => setLight(true)}
            onMouseLeave={() => {
              if (!anchorEl) setLight(false);
            }}
            src={light ? 'Images/image1.png' : 'Images/lightoff.png'}
            // sx={{ opacity: '0.9' }}
          ></Avatar>
          {/* <AccountCircleIcon
            sx={{ color: '#021C27', height: '60px', width: '60px' }}
          /> */}
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
            backgroundColor: '#0b171e',
            borderRadius: '7px',
            width: '220px',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'visible',
            // filter: 'drop-shadow(0 0 25px 0 rgba(248, 245, 245, 0.5))',
            boxShadow: '0 0 6px 0 rgba(248, 245, 245, 0.5)',
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
              backgroundColor: '#0b171e',
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
          onMouseEnter={(e) => (e.target.style.color = '#0f9595')}
          onMouseLeave={(e) => (e.target.style.color = '#f5f5f5')}
          className="logoutMenuButton"
          sx={{ fontFamily: 'Montserrat, sans-serif', fontSize: '20px' }}
        >
          &#9784; SETTINGS
        </MenuItem>
        <MenuItem
          sx={{ fontFamily: 'Montserrat, sans-serif', fontSize: '20px' }}
          onClick={handleLogOut}
          onMouseEnter={(e) => (e.target.style.color = '#0f9595')}
          onMouseLeave={(e) => (e.target.style.color = '#f5f5f5')}
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
