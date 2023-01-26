import React, { useState, useEffect } from 'react';
import './styles.css';
import { NavLink } from 'react-router-dom';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { navData } from './navData';
import { Modules } from 'src/client/Interfaces';

const HomeSidebar = (props: Modules) => {
  const [open, setOpen] = useState(true);

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className={open ? 'sidenav' : 'sidenavClosed'}>
      <div className="menuCollapse">
        <button className="menuBtn" onClick={toggleOpen}>
          Click Me
          {open ? (
            <KeyboardDoubleArrowLeftIcon />
          ) : (
            <KeyboardDoubleArrowRightIcon />
          )}
        </button>
      </div>
      <div className={open ? 'menuButtons' : 'menuButtonsClosed'}>
        {navData.map((item) => {
          return (
            <NavLink key={item.id} className="sideitem" to={item.link}>
              {item.icon}
              <span>{item.text}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default HomeSidebar;
