import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Delete, Put } from '../../Services/index';
import { apiRoute } from '../../utils';
import { signIn, deleteUser } from '../../Store/actions';
import NavBar from '../Home/NavBar';

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
        lastName: (document.getElementById('firstName-input') as HTMLInputElement).value
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
        password: (document.getElementById('login-password-input') as HTMLInputElement).value
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
    <div className='Admin'>
        <div>
          <h2>Admin Settings</h2>
          <div>
          <div>
              Update Administrator Account Details
            </div>
            <div>
              <input id="login-password-input" placeholder="Change Username" onKeyDown={handleEnterKeyDown} />
              <input id="login-password-input" placeholder="Change First Name" onKeyDown={handleEnterKeyDown} />
              <input id="login-password-input" placeholder="Change Last Name" onKeyDown={handleEnterKeyDown} />
            </div>
            <button className="btn" type="button" onClick={handleUpdate}>Update Admin Details</button>
          </div>
          <div>
            <div>
              Delete Administrator Account
            </div>
            <div>
              <input id="login-password-input" type="password" placeholder="Enter Password" onKeyDown={handleEnterKeyDown} />
            </div>
            <button className="btn" type="button" onClick={handleDelete}>Delete</button>
            <p className='input-error-text'>{passwordErr}</p>
          </div>
        </div>
      <NavBar />
    </div>
  );
};

export default Admin;
