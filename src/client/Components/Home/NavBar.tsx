import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IReducers } from '../../Interfaces/IReducers';
import { Get } from '../../Services';

import { setTitle, signIn } from '../../Store/actions';
import { apiRoute } from '../../utils';
import { Button, MenuItem, Menu } from '@mui/material';  
// const NavBar = () => {


//   const handleLogOut = (): void => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('username');
//     dispatch(signIn({
//       signInState: false,
//       username: ''
//     }));
//     navigate('/');
//   };

//   const dropdown = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     navigate('/' + e.target.value.toLowerCase());
//   };

  

//   return (
//     <div>
//       <div id='navbar'>
//         <span>{navBarReducer.title}</span>
//         <button className='btn' id='logout-btn' onClick={handleLogOut}>Logout</button>
//         <select id='dropdown' defaultValue='test' onChange={dropdown}>
//           <option value='test' disabled hidden>Dropdown</option>
//           <option value='Home'>Home</option>
//           <option value='Settings'>Settings</option>
//           <option value='Visualizer'>Visualizer</option>
//         </select>
//         <span id='username-navbar'>{'Username: ' + localStorage.getItem('username')}</span>
//       </div>
//     </div>
//   );
// };

export default function NavBar() {
  const navBarReducer = useSelector((state: IReducers) => state.navBarReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navBarOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const navBarClose = () => {
    setAnchorEl(null);
  };
  
  const routeHome = () => {
    navigate('/home');
  };

  const routeAdmin = () => {
    navigate('/admin');
  };

  const routeAddCluster = () => {
    navigate('/addcluster');
  };

  

  const handleLogOut = (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        dispatch(signIn({
          signInState: false,
          username: ''
        }));
        navigate('/');
      };

  return (
    <div id ='navbar'>
      <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={navBarOpen}
      >
        Ξ
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={navBarClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem value ='home' onClick={routeHome}>Home</MenuItem>
        <MenuItem value ='admin' onClick={routeAdmin}>Admin</MenuItem>
        <MenuItem value = 'visualizer' onClick={routeAddCluster}>Cluster</MenuItem>
        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
      </Menu>
      </div>
    </div>
  );
}
