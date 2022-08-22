import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Delete } from '../../Services/index';
import { apiRoute } from '../../utils';
import { signIn, deleteUser } from '../../Store/actions';
import NavBar from '../Home/NavBar';

const Settings = () => {
  const [passwordErr, setPasswordErr] = useState('')
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
  }

  

  const handleDelete = async (): Promise<void> => {
    try {
      const body = {
        username: localStorage.getItem('username'),
        password: (document.getElementById('login-password-input') as HTMLInputElement).value
      }

      //use a hook to fire off action(type: signIn, res)
      // console.log(res)


      const deleteStatus = await Delete(apiRoute.getRoute('user'), body, { authorization: localStorage.getItem('token') }).catch(err => console.log(err));
      console.log(deleteStatus)
      if (deleteStatus.deleted === true) {
        console.log('Your account has been deleted');
        dispatch(deleteUser({
          username: body.username
        }))
        handleLogOut();
      } else {
        console.log('Account could not be deleted - ')
      }
    } catch (err) {
      console.log('Delete request to server failed');
    }
  }
//   if(res.authorized === false) setMessage('wrong username/password')
  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if(e.key === 'Enter') handleDelete();

  }
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
              <input id="login-password-input" type="password" onKeyDown={handleEnterKeyDown}/>
            </div>
            <button className="btn" type="button" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings;
