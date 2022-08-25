import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Delete } from '../../Services/index';
import { apiRoute } from '../../utils';
import { signIn, deleteUser } from '../../Store/actions';
import NavBar from '../Home/NavBar';

const Settings = () => {
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

  const handleDelete = async (): Promise<void> => {
    try {

      const body = {
        username: localStorage.getItem('username'),
        password: (document.getElementById('login-password-input') as HTMLInputElement).value
      };

      // use a hook to fire off action(type: signIn, res)
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
    if (e.key === 'Enter') handleDelete();
  };

  return (
    <div className='Settings'>
      <div>
        <NavBar />
        <div>
          <h2>Delete User</h2>
          <div>
            <div>
              Please enter your password
            </div>
            <div>
              <input id="login-password-input" type="password" onKeyDown={handleEnterKeyDown} />
            </div>
            <button className="btn" type="button" onClick={handleDelete}>Delete</button>
          </div>
          <p className='input-error-text'>{passwordErr}</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
