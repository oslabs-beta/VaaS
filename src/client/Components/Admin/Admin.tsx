import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post, Put, Delete, Get } from '../../Services/index';
import { apiRoute } from '../../utils';

import { Accordion, AccordionSummary, AccordionDetails, Button, Container, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import NavBar from '../Home/NavBar';
import UserWelcome from '../Admin/UserWelcome';

const Admin = () => {
  const [passwordErr, setPasswordErr] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [addClusterMessage, setAddClusterMessage] = useState('');
  const navigate = useNavigate();

  const routeAddCluster = () => {
    navigate('/addcluster');
  };

  const handleLogOut = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleAdd = async () => {
    try {
      const body = {
        url: (document.getElementById('cluster-url') as HTMLInputElement).value,
        k8_port: (document.getElementById('k8_port') as HTMLInputElement).value,
        faas_port: (document.getElementById('faas_port') as HTMLInputElement).value,
        name: (document.getElementById('cluster-name') as HTMLInputElement).value,
        description: (document.getElementById('cluster-description') as HTMLInputElement).value,
      };
      if(!body.url || !body.k8_port || !body.faas_port || !body.name || !body.description) {
        setAddClusterMessage('Missing input fields');
        body.name = '';
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

  const handleUpdate = async (): Promise<void> => {
    try {
      const body = {
        username: (document.getElementById('username-input') as HTMLInputElement).value,
        firstName: (document.getElementById('firstName-input') as HTMLInputElement).value,
        lastName: (document.getElementById('lastName-input') as HTMLInputElement).value
      };
      // use a hook to fire off action(type: signIn, res)
      const updateStatus = await Put(apiRoute.getRoute('user'), body, { authorization: localStorage.getItem('token') }).catch(err => console.log(err));
      console.log(updateStatus);
      if (updateStatus.success) {
        console.log('Your account details have been updated');
      } else {
        console.log('Your account details could not be updated');
      }
    } catch (err) {
      console.log('Update request to server failed', err);
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      const body = {
        username: localStorage.getItem('username'),
        password: (document.getElementById('delete-password-input') as HTMLInputElement).value
      };
      const deleteStatus = await Delete(apiRoute.getRoute('user'), body, { authorization: localStorage.getItem('token') }).catch(err => console.log(err));
      console.log(deleteStatus);
      if (deleteStatus.deleted) {
        console.log('Your account has been deleted');
        handleLogOut();
      } else {
        console.log('Account could not be deleted - ');
        setPasswordErr('Incorrect password input');
      }
    } catch (err) {
      console.log('Delete request to server failed', err);
    }
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleUpdate();
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
                id="login-username-input"
                label="Username"
                type="username"
                autoComplete="current-password"
                variant="outlined"
                size='small'
                onSubmit={handleEnterKeyDown}
                margin="dense"
              />
              <TextField
                id="firstName-input"
                label="First Name"
                type="firstName"
                autoComplete="current-password"
                variant="outlined"
                size='small'
                onSubmit={handleEnterKeyDown}
                margin="dense"
              />
              <TextField
                id="lastName-input"
                label="Last Name"
                type="userName"
                autoComplete="current-password"
                variant="outlined"
                size='small'
                onSubmit={handleEnterKeyDown}
                margin="dense"
              />
            </div>
            <Button variant="contained" className="btn" type="button" onClick={handleUpdate}>Update Admin Details</Button>
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
                onSubmit={handleEnterKeyDown}
                margin="dense"
              />
            </div>
            <Button id="delete-password-input" variant="contained" className="btn" type="button" onClick={handleDelete}>Delete</Button>
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
            <span><Button variant="contained" className="btn" type="button" onClick={handleAdd}>Add Cluster</Button><span id='add-cluster-msg'>{addClusterMessage}</span></span>
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
