import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { IReducers } from '../../Interfaces';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
// import { setDarkMode } from '../../Store/actions';
import {
  fetchUser,
  editUser,
  deleteUser,
  // changeDarkMode,
  // changeRefreshRate,
} from '../../Queries';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
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
// * VaaS 4.0 - there are a lot of unused features that were partially developed by previous groups
// * we did not delete them all in case future groups want to implement these features
const Admin = (props: { refetch: any; handleAdminModal: any }) => {
  // Dispatch hook to dispatch actions to the store
  const dispatch = useAppDispatch();
  // Select the uiReducer from the store
  // const uiReducer = useAppSelector((state: IReducers) => state.uiReducer);

  // React hooks to maintain local state
  const [updateUserErr, setUpdateUserErr] = useState('');
  const [deletePasswordErr, setDeletePasswordErr] = useState('');
  // const [addClusterMessage, setAddClusterMessage] = useState('');
  const [currUser, setCurrUser] = useState<any>({});
  // const darkMode = uiReducer.clusterUIState.darkmode;
  // const [updateRefreshRateMessage, setUpdateRefreshRateMessage] = useState('');
  // const [refreshRate, setRefreshRate] = useState(0);
  const navigate = useNavigate();
  // fetch Query
  const { data: userData, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });
  useEffect(() => {
    setCurrUser(userData);
    // dispatch(setDarkMode(userData?.darkMode));
    // setRefreshRate(userData?.refreshRate / 1000);
  }, [dispatch, userData]);

  // React query mutations used for requests other than get requests, used to get more efficient requests

  const userMutation = useMutation(
    (data: { username: string; firstName: string; lastName: string }) =>
      editUser(data),
    {
      onSuccess: (response) => {
        response.success
          ? setUpdateUserErr('Account updated')
          : setUpdateUserErr('Update unuccessful');
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
  // const darkModeMutation = useMutation(
  //   (data: { darkMode: boolean }) => changeDarkMode(data),
  //   {
  //     onSuccess: (response) => {
  //       response.success
  //         ? dispatch(setDarkMode(!darkMode))
  //         : console.log('Dark mode could not be enabled');
  //     },
  //   }
  // );
  // const refreshRateMutation = useMutation(
  //   (data: { refreshRate: number }) => changeRefreshRate(data),
  //   {
  //     onSuccess: (response) => {
  //       if (response.success) {
  //         refetch();
  //         setUpdateRefreshRateMessage(
  //           `Refresh rate successfully set to ${
  //             userData.refreshRate / 1000
  //           } seconds`
  //         );
  //       } else setUpdateRefreshRateMessage('Refresh rate could not be updated');
  //     },
  //   }
  // );
  // * Styles
  const textFieldStyle = {
    background: '#FFFFFF',
    borderRadius: '5px',
    marginBottom: '0px',
    width: '250px',
    fontSize: '10px',
  };
  const buttonStyle = {
    background: '#3a4a5b',
    borderRadius: '5px',
    marginBottom: '0px',
    width: '250px',
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

  // const handleDarkMode = async (): Promise<void> => {
  //   try {
  //     const body = {
  //       darkMode: !darkMode,
  //     };
  //     darkModeMutation.mutate(body);
  //   } catch (err) {
  //     console.log('Update request to server failed', err);
  //   }
  // };

  // const handleRefreshRate = async (): Promise<void> => {
  //   try {
  //     const body = {
  //       refreshRate:
  //         Number(
  //           (document.getElementById('refresh-rate-input') as HTMLInputElement)
  //             .value
  //         ) * 1000,
  //     };
  //     refreshRateMutation.mutate(body);
  //   } catch (err) {
  //     console.log('Update request to server failed', err);
  //   }
  // };

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

  // const handleEnterKeyDownRefreshRate = (
  //   e: React.KeyboardEvent<HTMLInputElement>
  // ): void => {
  //   if (e.key === 'Enter') handleRefreshRate();
  // };

  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setValue(newValue);
  // };

  return (
    <div id="HomeContainer">
      <Container
        className={'Admin-Modal-Container'}
        sx={{
          color: '#f5f5f5',
          height: '430px',
          width: '350px',
          display: 'flex',
          padding: '0px',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: '40%',
          left: '50%',
          flexDirection: 'column',
          backgroundColor: '#0b171e',
          boxShadow: '1px 1px 10px .5px rgba(198, 195, 195, 0.5)',
          borderRadius: '10px',
          marginBottom: '20px',
          transform: 'translate(-50%, -50%)',
          zIndex: 999,
        }}
      >
        <h1 id="account-details">Account Details</h1>
        <TextField
          onKeyDown={handleEnterKeyDownUpdate}
          id="update-username-input"
          type="text"
          label="Username"
          variant="filled"
          size="small"
          margin="dense"
          sx={textFieldStyle}
        />

        <TextField
          onKeyDown={handleEnterKeyDownUpdate}
          id="update-firstName-input"
          type="text"
          label="First Name"
          variant="filled"
          size="small"
          margin="dense"
          sx={textFieldStyle}
        />

        <TextField
          onKeyDown={handleEnterKeyDownUpdate}
          id="update-lastName-input"
          type="text"
          label="Last Name"
          variant="filled"
          size="small"
          margin="dense"
          sx={textFieldStyle}
        />

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
      </Container>
    </div>
  );
};

export default Admin;
