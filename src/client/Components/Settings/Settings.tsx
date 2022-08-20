import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Get, Delete } from '../../Services/index';
import { apiRoute } from '../../utils';
import { IReducers } from '../../Interfaces/IReducers';
import { deleteUser } from '../../Store/actions';




const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (): Promise<void> => {
    try {
      const body = {
        username : localStorage.getItem('username'),
        password: (document.getElementById('login-password-input') as HTMLInputElement).value
      }
      const auth = await Get(apiRoute.getRoute('auth'), body).catch(err => console.log(err));
      //use a hook to fire off action(type: signIn, res)
      // console.log(res)
      if(auth.authorized === true) {
        try{
          const deleteStatus = await Delete(apiRoute.getRoute('user'), body, {authorization: localStorage.getItem('token')}).catch(err => console.log(err));
          if (deleteStatus.deleted === true){
            console.log('Your account has been deleted');
            dispatch(deleteUser({
              username: body.username
            }))
            navigate('/home');
          } else {
            console.log('Account could not be deleted - ')
          }
        } catch(err) {
          console.log('Delete request to server failed');
        }
      } else {
        console.log('Incorrect password, please try again')
      }
    //   if(res.authorized === false) setMessage('wrong username/password')
    } 
    catch (err) {
      console.log('Get failed');
    }
  }

    return (
      <div className = 'Settings'>
        <div>
            <h1>Settings</h1>
          <div>
            <h2>Delete User</h2>
              <div>
                <div>
                  Please enter your password
                </div>
              <div>
                <input id="login-password-input" type="password" />
              </div>
            <button className="btn" type="button" onClick={handleDelete}>Delete</button>
          </div>
          </div>
        </div>
      </div>
      )
}

export default Settings;


