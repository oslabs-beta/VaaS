import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { LoginStates } from '../../Interfaces/ILogin';
import { apiRoute } from '../../utils';
import { signIn } from '../../Store/actions'
import { Get, Post, Put, Delete } from '../../Services/index';
import './styles.css';

//put this in with other types later on
interface reducers {
  appReducer: Record<string, unknown>
}


const Login = ({ welcome }: LoginStates) => {
  const [message, setMessage] = useState(welcome);
  const dispatch = useDispatch();
  const appReducer = useSelector((state: reducers) => state.appReducer)
  // const welcomeMsg = useSelector((state: LoginStates) => state)

  useEffect(() => {
    console.log(appReducer.signInState)
    // setMessage(welcomeMsg)
    // console.log(counter);
  }, [appReducer]);

  const handleLogin = async (): Promise<void> => {
    // dispatch(signIn({
    //   username: (document.getElementById('login-username-input') as HTMLInputElement).value,
    //   password: (document.getElementById('login-password-input') as HTMLInputElement).value
    // }))
    try {
      const body = {
        username: (document.getElementById('login-username-input') as HTMLInputElement).value,
        password: (document.getElementById('login-password-input') as HTMLInputElement).value
      }
      // const res = await Put(apiRoute.getRoute('auth'), body);
      //use a hook to fire off action(type: signIn, res)
      let res;
      if(body.username)
        res = true;
      else res = false

      dispatch(signIn(res));
      // console.log(res);
      
    } catch (err) {
      console.log('Get failed');
    }
  }

  return (
    <div className="login-container">
      <div>
        <h1>{message}</h1>
      </div>
      <div>
        <span>Username:</span>
        <input id="login-username-input" />
      </div>
      <div>
        <span>Password:</span>
        <input id="login-password-input" type="password" />
      </div>
      {/* <Link to="/home"><button className="btn-login" type="button" onClick={handleLogin}>Login</button></Link> */}
      <button className="btn-login" type="button" onClick={handleLogin}>Login</button>
      <Link to="/register"><button type="button">Register</button></Link>
      {/* <div>Counter: {counter}</div> */}
    </div>
  )
}

export default Login;
// export default connect(mapStateToProps, mapDispatcherToProps)(Login)