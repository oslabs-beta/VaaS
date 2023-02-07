import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AddClusterType, IReducers } from '../../Interfaces';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { setDarkMode } from '../../Store/actions';
import {
  addCluster,
  fetchUser,
  editUser,
  deleteUser,
  changeDarkMode,
  changeRefreshRate,
} from '../../Queries';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import './styles.css';

// Define the Admin type, setting types for the properties
// Associated with Admin accounts
type Admin = {
  cookieId: string;
  darkMode: boolean;
  firstName: string;
  lastName: string;
  password: string;
  refreshRate: number;
  username: string;
  _id: string;
};

// Create the Admin component
const Admin = (props: { refetch: any; handleAdminModal: any }) => {
  // Dispatch hook to dispatch actions to the store
  const dispatch = useAppDispatch();
  // Select the uiReducer from the store
  const uiReducer = useAppSelector((state: IReducers) => state.uiReducer);

  // React hooks to maintain local state
  const [updateUserErr, setUpdateUserErr] = useState('');
  const [deletePasswordErr, setDeletePasswordErr] = useState('');
  // const [addClusterMessage, setAddClusterMessage] = useState('');
  const [currUser, setCurrUser] = useState<Admin | unknown>({});
  const darkMode = uiReducer.clusterUIState.darkmode;
  const [updateRefreshRateMessage, setUpdateRefreshRateMessage] = useState('');
  const [refreshRate, setRefreshRate] = useState(0);
  // mui tabs uses this to change tabs
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  // fetch Query
  const { data: userData, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });
  useEffect(() => {
    setCurrUser(userData);
    dispatch(setDarkMode(userData?.darkMode));
    setRefreshRate(userData?.refreshRate / 1000);
  }, [dispatch, userData]);

  // React query mutations used for requests other than get requests, used to get more efficient requests

  const userMutation = useMutation(
    (data: { username: string; firstName: string; lastName: string }) =>
      editUser(data),
    {
      onSuccess: (response) => {
        response.success
          ? setUpdateUserErr('Account information successfully updated')
          : setUpdateUserErr('Your account details could not be updated');
      },
    }
  );
  const userDeleteMutation = useMutation(
    (body: { username: string; password: string }) => deleteUser(body),
    {
      onSuccess: (response) => {
        response.deleted
          ? navigate('/')
          : setDeletePasswordErr('Incorrect password');
      },
    }
  );
  const darkModeMutation = useMutation(
    (data: { darkMode: boolean }) => changeDarkMode(data),
    {
      onSuccess: (response) => {
        response.success
          ? dispatch(setDarkMode(!darkMode))
          : console.log('Dark mode could not be enabled');
      },
    }
  );
  const refreshRateMutation = useMutation(
    (data: { refreshRate: number }) => changeRefreshRate(data),
    {
      onSuccess: (response) => {
        if (response.success) {
          refetch();
          setUpdateRefreshRateMessage(
            `Refresh rate successfully set to ${
              userData.refreshRate / 1000
            } seconds`
          );
        } else setUpdateRefreshRateMessage('Refresh rate could not be updated');
      },
    }
  );
  // Styles
  const containerStyle = {
    width: '350px',
    marginTop: '-10px',
  };
  const textFieldStyle = {
    background: '#FFFFFF',
    borderRadius: '5px',
    marginBottom: '0px',
    width: '100%',
    fontSize: '10px',
  };
  const buttonStyle = {
    background: '#3a4a5b',
    borderRadius: '5px',
    marginBottom: '0px',
    width: '100%',
    fontSize: '10px',
  };
  // handler functions

  const handleUserUpdate = async (): Promise<void> => {
    try {
      const body = {
        username: (
          document.getElementById('update-username-input') as HTMLInputElement
        ).value,
        firstName: (
          document.getElementById('update-firstName-input') as HTMLInputElement
        ).value,
        lastName: (
          document.getElementById('update-lastName-input') as HTMLInputElement
        ).value,
      };
      if (!body.username && !body.firstName && !body.lastName) {
        setUpdateUserErr('No inputs in input fields');
        return;
      }
      if (!body.username) body.username = userData.username;
      if (!body.firstName) body.firstName = userData.firstName;
      if (!body.lastName) body.lastName = userData.lastName;

      userMutation.mutate(body);
    } catch (err) {
      console.log('Update request to server failed', err);
    }
  };

  const handleUserDelete = async (): Promise<void> => {
    try {
      const userBody = {
        username: currUser.username,
        password: (
          document.getElementById('delete-password-input') as HTMLInputElement
        ).value,
      };
      userDeleteMutation.mutate(userBody);
    } catch (err) {
      console.log('Delete request to server failed', err);
    }
  };

  const handleDarkMode = async (): Promise<void> => {
    try {
      const body = {
        darkMode: !darkMode,
      };
      darkModeMutation.mutate(body);
    } catch (err) {
      console.log('Update request to server failed', err);
    }
  };

  const handleRefreshRate = async (): Promise<void> => {
    try {
      const body = {
        refreshRate:
          Number(
            (document.getElementById('refresh-rate-input') as HTMLInputElement)
              .value
          ) * 1000,
      };
      refreshRateMutation.mutate(body);
    } catch (err) {
      console.log('Update request to server failed', err);
    }
  };

  const handleEnterKeyDownUpdate = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') handleUserUpdate();
  };

  const handleEnterKeyDownDelete = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') handleUserDelete();
  };

  const handleEnterKeyDownRefreshRate = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') handleRefreshRate();
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Implementing MUI tabs
  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div id="HomeContainer">
      <Container
        className={'Admin-Modal-Container'}
        sx={{
          color: 'white',
          minHeight: '65%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgb(0,0,0)',
          boxShadow: '1px 1px 10px .5px rgba(248, 245, 245, 0.5)',
          borderRadius: '0px',
          marginBottom: '20px',
          zIndex: 999,
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{
                color: '#FFF',
              }}
              TabIndicatorProps={{
                style: {
                  backgroundColor: '#2074FF',
                },
              }}
              centered
            >
              <Tab
                label="Account Details"
                {...a11yProps(0)}
                sx={{
                  color: '#FFF',
                }}
              />
              {/* <Tab
                label="About"
                {...a11yProps(2)}
                sx={{
                  color: '#FFF',
                }}
              /> */}
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Container sx={containerStyle}>
              <TextField
                onKeyDown={handleEnterKeyDownUpdate}
                autoComplete="current-password"
                id="update-username-input"
                type="username"
                label="Username"
                variant="filled"
                size="small"
                margin="dense"
                sx={textFieldStyle}
              />

              <TextField
                onKeyDown={handleEnterKeyDownUpdate}
                autoComplete="current-password"
                id="update-firstName-input"
                type="firstName"
                label="First Name"
                variant="filled"
                size="small"
                margin="dense"
                sx={textFieldStyle}
              />

              <TextField
                onKeyDown={handleEnterKeyDownUpdate}
                autoComplete="current-password"
                id="update-lastName-input"
                type="userName"
                label="Last Name"
                variant="filled"
                size="small"
                margin="dense"
                sx={textFieldStyle}
              />
              <div>
                <Button
                  variant="contained"
                  className="btn"
                  type="button"
                  onClick={handleUserUpdate}
                  sx={buttonStyle}
                >
                  Update Admin Details
                </Button>
                <span id="update-user-err">{updateUserErr}</span>
              </div>

              <TextField
                onKeyDown={handleEnterKeyDownDelete}
                id="delete-password-input"
                type="password"
                label="Enter Password to Confirm Deletion"
                variant="filled"
                size="small"
                margin="dense"
                sx={textFieldStyle}
              />
              <div>
                <Button
                  id="delete-password-input"
                  variant="contained"
                  className="btn"
                  type="button"
                  onClick={handleUserDelete}
                  sx={buttonStyle}
                >
                  Delete
                </Button>
                <span id="delete-password-err">{deletePasswordErr}</span>
              </div>
            </Container>
          </TabPanel>
          {/* <TabPanel value={value} index={1}>
            <Container sx={containerStyle}>
              <Button
                variant="contained"
                type="button"
                className="btn"
                sx={buttonStyle}
                onClick={() =>
                  window.open(
                    'https://vaas.dev/',
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
              >
                Learn about the project
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <h3 id="developed">Developed by:</h3>
                <p>Brandon Muniz-Rosado</p>
                <p>Christopher Tenario</p>
                <p>Johanna Merluza</p>
                <p>Terrence Granger</p>
                <p>Steven Tong</p>
                <p>Young Kim</p>
                <p>Ahsan Ali </p>
                <p>Rabea Ahmad</p>
                <p>Stephan Chiorean</p>
                <p>Ruqayaah Sabitu</p>
                <p>James Chan</p>
                <p>Jimmy Lim</p>
                <p>Alex Kaneps</p>
                <p>Matthew McGowan</p>
                <p>Vu Duong</p>
                <p>Murad Alqadi</p>
                <p>Kevin Le</p>
                <p>Richard Zhang</p>
                <p>Irvin Ie</p>
              </Box>
            </Container>
          </TabPanel> */}
        </Box>
      </Container>
    </div>
  );
};

export default Admin;
