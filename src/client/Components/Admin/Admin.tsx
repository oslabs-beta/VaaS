import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Delete, Put } from '../../Services/index';
import { apiRoute } from '../../utils';
import { signIn, deleteUser } from '../../Store/actions';

import { Accordion, AccordionSummary, AccordionDetails, Box, Button, Container, TextField} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import NavBar from '../Home/NavBar';
import { Title } from '@mui/icons-material';

const Admin = () => {
  const [passwordErr, setPasswordErr] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    dispatch(signIn({
      signInState: false,
      username: ''
    }));
    navigate('/');
  };

  const handleUpdate = async (): Promise<void> => {
    try {
      const body = {
        username: localStorage.getItem('username'),
        firstName: (document.getElementById('firstName-input') as HTMLInputElement).value,
        lastName: (document.getElementById('lastName-input') as HTMLInputElement).value
      };
      // use a hook to fire off action(type: signIn, res)
      const updateStatus = await Put(apiRoute.getRoute('user'), body, { authorization: localStorage.getItem('token') }).catch(err => console.log(err));
      console.log(updateStatus);
      if (updateStatus.success) {
        console.log('Your account details have been updated');
        handleLogOut();
      } else {
        console.log('Your account details could not be updated');
      }
    } catch (err) {
      console.log('Update request to server failed');
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
      console.log('Delete request to server failed');
    }
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleUpdate();
  };

  return (
    // <div className='Admin'>
    //     <div>
    //       <h2>Admin Settings</h2>
    //       <div>
    //       <div>
    //           Update Administrator Account Details
    //         </div>
    //         <div>
    //           <input id="login-password-input" placeholder="Change Username" onKeyDown={handleEnterKeyDown} />
    //           <input id="login-password-input" placeholder="Change First Name" onKeyDown={handleEnterKeyDown} />
    //           <input id="login-password-input" placeholder="Change Last Name" onKeyDown={handleEnterKeyDown} />
    //         </div>
    //         <button className="btn" type="button" onClick={handleUpdate}>Update Admin Details</button>
    //       </div>
    //       <div>
    //         <div>
    //           Delete Administrator Account
    //         </div>
    //         <div>
    //           <input id="login-password-input" type="password" placeholder="Enter Password" onKeyDown={handleEnterKeyDown} />
    //         </div>
    //         <button className="btn" type="button" onClick={handleDelete}>Delete</button>
    //         <p className='input-error-text'>{passwordErr}</p>
    //       </div>
    //     </div>
    //   
    // </div>

    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div>Administrator Account Details</div>
        </AccordionSummary>
        <AccordionDetails>
          <Container sx={{
          }}
          >
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
      <NavBar />
    </div>
  );
};

export default Admin;
