import React from 'react';
import { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { Box, IconButton, Typography, useTheme } from '@mui/material'; //INEFFICENT Load????
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import LanRoundedIcon from '@mui/icons-material/LanRounded';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import ViewInAr from '@mui/icons-material/ViewInAr';
import QueryStats from '@mui/icons-material/QueryStats';
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined';
import FunctionsOutlined from '@mui/icons-material/Functions';
import AttachMoneyOutlined from '@mui/icons-material/AttachMoney';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

//import "react-pro-sidebar/dist/css/styles.css";

const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      sx={{ backgroundColor: '#E5E4E2' }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const MenuSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState('false'); // what is the default state? "false"
  const [selected, setSelected] = useState(); // what is the default state? "Dashboard"

  //REMEMBER TO WRAP APP in ProSideBar

  return (
    <Sidebar collapsed={isCollapsed}>
      <Menu iconShape="square">
        <MenuItem
          onClick={() => setIsCollapsed(!isCollapsed)}
          icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
          style={{
            margin: '10px 0 20px 0',
            color: '#D3D3D3',
          }}
        >
          {!isCollapsed && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              ml="15px"
            >
              <Typography>VaaS</Typography>
              <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                <MenuOutlinedIcon />
              </IconButton>
            </Box>
          )}
        </MenuItem>

        <Box paddingLeft={isCollapsed ? undefined : '10%'}>
          <Item
            title="Clusters"
            to="/home"
            icon={<LanRoundedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Dashboards"
            to="/home"
            icon={<AnalyticsOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Cluster Map"
            to="/home"
            icon={<ViewInAr />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Queries"
            to="/home"
            icon={<QueryStats />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Alerts"
            to="/home"
            icon={<NotificationImportantOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="OpenFaas"
            to="/home"
            icon={<FunctionsOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="OpenFaas Cost"
            to="/home"
            icon={<AttachMoneyOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="About"
            to="/home"
            icon={<InfoOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
        </Box>
      </Menu>
    </Sidebar>
  );
};

export default MenuSidebar;
