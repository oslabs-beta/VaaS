import { useState } from 'react';
import { ProSidebarProvider, Menu, MenuItem } from 'react-pro-sidebar';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(); // what is the default state? "false"
  const [selected, setSelected] = useState(); // what is the default state? "Dashboard"

  //REMEMBER TO WRAP APP in ProSideBar

  return (
    <ProSidebar collapsed={isCollapsed}>
      <Menu iconShape="square"></Menu>
    </ProSidebar>
  );
};

export default Sidebar;
