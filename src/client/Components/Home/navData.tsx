import React from 'react';
import LanRoundedIcon from '@mui/icons-material/LanRounded';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import ViewInAr from '@mui/icons-material/ViewInAr';
import QueryStats from '@mui/icons-material/QueryStats';
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined';
import FunctionsOutlined from '@mui/icons-material/Functions';
import AttachMoneyOutlined from '@mui/icons-material/AttachMoney';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const navData = [
  {
    id: 0,
    icon: <LanRoundedIcon />,
    text: 'Clusters',
    link: '/home',
  },
  {
    id: 1,
    icon: <AnalyticsOutlinedIcon />,
    text: 'Dashboards',
    link: '/module',
  },
  {
    id: 2,
    icon: <ViewInAr />,
    text: 'Cluster Map',
    link: '/home',
  },
  {
    id: 3,
    icon: <QueryStats />,
    text: 'Queries',
    link: '/home',
  },
  {
    id: 4,
    icon: <NotificationImportantOutlinedIcon />,
    text: 'Alerts',
    link: '/home',
  },
  {
    id: 5,
    icon: <FunctionsOutlined />,
    text: 'OpenFaas',
    link: '/home',
  },
  {
    id: 6,
    icon: <AttachMoneyOutlined />,
    text: 'OpenFaas Cost',
    link: '/home',
  },
  {
    id: 7,
    icon: <InfoOutlinedIcon />,
    text: 'About',
    link: '/home',
  },
];
