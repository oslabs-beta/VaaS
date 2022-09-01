import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post, Put, Delete, Get } from '../../Services/index';
import { apiRoute } from '../../utils';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';


import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import NavBar from '../Home/NavBar';
import UserWelcome from '../Admin/UserWelcome';
import { ClusterTypes } from '../../Interfaces/ICluster';

const Admin = () => {
  const [updateUserErr, setUpdateUserErr] = useState('');
  const [deletePasswordErr, setDeletePasswordErr] = useState('');
  const [addClusterMessage, setAddClusterMessage] = useState('');
  const navigate = useNavigate();

  const handleAddCluster = async (): Promise<void> => {
    try {
      const body = {
        url: (document.getElementById('cluster-url') as HTMLInputElement).value,
        k8_port: (document.getElementById('k8_port') as HTMLInputElement).value,
        faas_port: (document.getElementById('faas_port') as HTMLInputElement).value,
        name: (document.getElementById('cluster-name') as HTMLInputElement).value,
        description: (document.getElementById('cluster-description') as HTMLInputElement).value,
      };
      if (!body.url || !body.k8_port || !body.faas_port || !body.name || !body.description) {
        setAddClusterMessage('Missing input fields');
        return;
      }
      const res = await Get(apiRoute.getRoute(`cluster:${body.name}`), { authorization: localStorage.getItem('token') });
      console.log(res);
      if (res.message) {
        await Post(apiRoute.getRoute('cluster'), body, { authorization: localStorage.getItem('token') });
        setAddClusterMessage('Successfully added cluster');
      }
      else setAddClusterMessage('Cluster with name already exists');
    } catch (err) {
      console.log('Add cluster failed', err);
    }
  };

  const handleUserUpdate = async (): Promise<void> => {
    try {
      const body = {
        username: (document.getElementById('update-username-input') as HTMLInputElement).value,
        firstName: (document.getElementById('update-firstName-input') as HTMLInputElement).value,
        lastName: (document.getElementById('update-lastName-input') as HTMLInputElement).value
      };
      if(!body.username && !body.firstName && !body.lastName) {
        setUpdateUserErr('No inputs in input fields');
        return;
      }
      const user = await Get(apiRoute.getRoute(`user:${localStorage.username}`), { authorization: localStorage.getItem('token') });
      console.log(user);
      if(!body.username) body.username = user.username;
      if(!body.firstName) body.firstName = user.firstName;
      if(!body.lastName) body.lastName = user.lastName;
      const updateStatus = await Put(apiRoute.getRoute('user'), body, { authorization: localStorage.getItem('token') }).catch(err => console.log(err));
      if (updateStatus.success) {
        localStorage.setItem('username', body.username);
        setUpdateUserErr('User successfully updated');
        console.log('Your account details have been updated');
      } else {
        console.log('Your account details could not be updated');
      }
    } catch (err) {
      console.log('Update request to server failed', err);
    }
  };

  const handleUserDelete = async (): Promise<void> => {
    try {
      const userBody = {
        username: localStorage.getItem('username'),
        password: (document.getElementById('delete-password-input') as HTMLInputElement).value
      };
      const deleteStatus = await Delete(apiRoute.getRoute('user'), userBody, { authorization: localStorage.getItem('token') }).catch(err => console.log(err));
      console.log(deleteStatus);
      const clusters = await Get(apiRoute.getRoute('cluster'), { authorization: localStorage.getItem('token') });
      console.log(clusters);
      clusters.forEach(async (cluster: ClusterTypes) => {
        const clusterBody = {
          clusterId: cluster._id,
          favorite: false,
        };
        await Put(apiRoute.getRoute('cluster'), clusterBody, { authorization: localStorage.getItem('token') });
      });
      if (deleteStatus.deleted) {
        console.log('Your account has been deleted');

        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
      } else {
        console.log('Account could not be deleted - ');
        setDeletePasswordErr('Incorrect password');
      }
    } catch (err) {
      console.log('Delete request to server failed', err);
    }
  };

  const handleEnterKeyDownUpdate = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleUserUpdate();
  };

  const handleEnterKeyDownDelete = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleUserDelete();
  };

  return (
    <div>
      <UserWelcome />
      <Accordion sx={{
        marginTop: '0.5rem'
      }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div>Administrator Account Details</div>
        </AccordionSummary>
        <AccordionDetails>
          <Container>
            <div>
              <TextField
                id="update-username-input"
                label="Username"
                type="username"
                autoComplete="current-password"
                variant="outlined"
                size='small'
                onKeyDown={handleEnterKeyDownUpdate}
                margin="dense"
              />
              <TextField
                id="update-firstName-input"
                label="First Name"
                type="firstName"
                autoComplete="current-password"
                variant="outlined"
                size='small'
                onKeyDown={handleEnterKeyDownUpdate}
                margin="dense"
              />
              <TextField
                id="update-lastName-input"
                label="Last Name"
                type="userName"
                autoComplete="current-password"
                variant="outlined"
                size='small'
                onKeyDown={handleEnterKeyDownUpdate}
                margin="dense"
              />
            </div>
            <span>
              <Button variant="contained" className="btn" type="button" onClick={handleUserUpdate}>Update Admin Details</Button>
              <span id='update-user-err'>{updateUserErr}</span>
            </span>
          </Container>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <div>Delete Administrator Account</div>
        </AccordionSummary>
        <AccordionDetails>
          <Container>
            <div>
              <TextField
                id="delete-password-input"
                label="Enter Password"
                type="password"
                variant="outlined"
                size='small'
                onKeyDown={handleEnterKeyDownDelete}
                margin="dense"
              />
            </div>
            <span>
              <Button id="delete-password-input" variant="contained" className="btn" type="button" onClick={handleUserDelete}>Delete</Button>
              <span id='delete-password-err'>{deletePasswordErr}</span>
            </span>
          </Container>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{
        marginTop: '0.5rem'
      }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div>Add Cluster</div>
        </AccordionSummary>
        <AccordionDetails>
          <Container>
            <TextField
              id="cluster-url"
              label="Cluster URL"
              type="username"
              variant="outlined"
              size='small'
              margin="dense"
            />
            <div>
              <TextField
                id="k8_port"
                label="Kubernetes Port"
                type="text"
                variant="outlined"
                size='small'
                margin="dense"
              />
            </div>
            <div>
              <TextField
                id="faas_port"
                label="FaaS Port"
                type="text"
                variant="outlined"
                size='small'
                margin="dense"
              />
            </div>
            <div>
              <TextField
                id="cluster-name"
                label="Cluster Name"
                type="text"
                variant="outlined"
                size='small'
                margin="dense"
              />
            </div>
            <div>
              <TextField
                id="cluster-description"
                label="Cluster Description"
                type="text"
                variant="outlined"
                size='small'
                margin="dense"
              />
            </div>
            <span>
              <Button variant="contained" className="btn" type="button" onClick={handleAddCluster}>Add Cluster</Button>
              <span id='add-cluster-msg'>{addClusterMessage}</span>
            </span>
          </Container>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{
      }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <div>View All Clusters</div>
        </AccordionSummary>
        <AccordionDetails>
          <Container>
            <Button variant="contained" className="btn" type="button">View All Clusters</Button>
          </Container>
        </AccordionDetails>
      </Accordion>
      <NavBar />
    </div>
  );
};

export default Admin;
