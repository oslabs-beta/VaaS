import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { registerUser } from '../../Queries';
import LoadingButton from '@mui/lab/LoadingButton';
import { RegisterTypes } from '../../../client/Interfaces';

const Register = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<RegisterTypes>({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const disabled =
    !fields.firstName ||
    !fields.lastName ||
    !fields.username ||
    !fields.password;

  const handleSignUp = async (): Promise<void> => {
    // * VaaS 4.0 add input checking to ensure inputs are valid
    // regex to check for alphabetic characters and accents, and spaces
    const alphaSpace = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/;
    // regex to check for alphabetic characters, accents only
    const alphaOnly = /[a-zA-ZÀ-ÖØ-öø-ÿ]/;
    // regex to check for alphanumeric characters only
    const alphaNum = /^([0-9]|[a-z])+([0-9a-z]+)$/i;
    const firstNameCheck =
      alphaOnly.test(fields.firstName) &&
      alphaSpace.test(fields.firstName) &&
      fields.firstName[0] !== ' ' &&
      fields.firstName.length > 0;
    const lastNameCheck =
      alphaOnly.test(fields.lastName) &&
      alphaSpace.test(fields.lastName) &&
      fields.lastName[0] !== ' ' &&
      fields.lastName.length > 0;
    const userCheck =
      alphaNum.test(fields.username) && fields.username.length > 2;
    const pwCheck =
      alphaNum.test(fields.password) && fields.password.length > 3;
    if (!firstNameCheck || !lastNameCheck) return setError('Invalid name');
    if (!userCheck || !pwCheck) return setError('Invalid username or password');
    setLoading(true);
    try {
      const response = await registerUser({ ...fields });
      if (response.data.userId) navigate('/home');
      else {
        if (
          response.data.message &&
          response.data.message.includes('already exists')
        )
          setError('Username already exists');
        else setError('Invalid entry');
      }
      return setLoading(false);
    } catch (error) {
      setError('There was an error logging in');
      setLoading(false);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError('');
    const {
      target: { name, value },
    } = e;
    setFields({ ...fields, [name]: value });
  };
  // when click on enter key, invoke signup func
  const handleEnterKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') {
      if (disabled) return;
      handleSignUp();
    }
  };
  return (
    <div className="outer-register-container">
      <div className="container">
        <Container
          id="login-logo-container"
          sx={{
            height: '100%',
            marginTop: '3em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            alt="login icon"
            id="register-icon"
            className="login-icon"
            src="Images/image1.png"
          />

          <Typography
            className="vaas-text"
            id="vaas-register-text"
            // sx={{
            //   fontSize: '2.5rem',
            //   marginTop: '0',
            //   marginBottom: '2vh',
            //   paddingTop: '0',
            //   letterSpacing: '0.3rem',
            //   color: '#fff',
            // }}
          >
            VaaS
          </Typography>
        </Container>
        <Container
          // sx={{
          // minWidth: '100%',
          // justifyContent: 'center',
          // display: 'flex',
          // direction: 'column',
          // textAlign: 'center',
          // alignItems: 'center',
          // backgroundSize: 'contain',
          // bgColor: '#3a4a5b',
          // }}
          className="backdrop"
        >
          <Container
            className="login-container"
            sx={{
              display: 'flex',
              width: '100%',
              // minWidth: '250px',
              // maxWidth: '600px',
              // direction: 'column',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              // backgroundRepeat: 'no-repeat',
              padding: '0.5rem',
              // border: '0px solid #eaeaea',
            }}
          >
            <div>
              <h2 id="registration">Registration</h2>
              {/* {error && <span style={{ color: 'red' }}>{error}</span>} */}
              {error ? (
                <div className="error">{error}</div>
              ) : (
                <div className="nonError"> </div>
              )}
            </div>
            <TextField
              id="firstName-input"
              label="First Name"
              name="firstName"
              value={fields.firstName}
              type="string"
              variant="standard"
              margin="dense"
              onKeyDown={handleEnterKeyDown}
              onChange={(e) => handleChange(e)}
              fullWidth={true}
              sx={{
                input: { color: '#fff' },
                label: { color: '#fff' },
                borderBottom: '1px solid #fff',
                marginTop: '0',
              }}
            />
            <TextField
              id="lastName-input"
              label="Last Name"
              name="lastName"
              value={fields.lastName}
              type="string"
              size="small"
              variant="standard"
              margin="dense"
              onKeyDown={handleEnterKeyDown}
              onChange={(e) => handleChange(e)}
              fullWidth={true}
              sx={{
                input: { color: '#fff' },
                label: { color: '#fff' },
                borderBottom: '1px solid #fff',
              }}
            />
            <TextField
              id="register-username-input"
              label="Username"
              type="username"
              name="username"
              value={fields.username}
              size="small"
              autoComplete="new-username"
              variant="standard"
              onKeyDown={handleEnterKeyDown}
              onChange={(e) => handleChange(e)}
              margin="dense"
              fullWidth={true}
              sx={{
                input: { color: '#fff' },
                label: { color: '#fff' },
                borderBottom: '1px solid #fff',
              }}
            />
            <TextField
              id="register-password-input"
              label="Password"
              type="password"
              name="password"
              value={fields.password}
              size="small"
              autoComplete="new-password"
              variant="standard"
              margin="dense"
              onKeyDown={handleEnterKeyDown}
              onChange={(e) => handleChange(e)}
              fullWidth={true}
              sx={{
                input: { color: '#fff' },
                label: { color: '#fff' },
                borderBottom: '1px solid #fff',
              }}
            />
            <Container
              id="buttonContainer"
              sx={{
                width: '100%',
                direction: 'column',
                textAlign: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row-reverse',
                justifyContent: 'center',
                padding: '0.5rem',
                marginTop: '1em',
                marginBottom: '7em',
                height: '100%',
                // '@media screen and (max-width: 550px)': {
                //   marginBottom: '5em',
                // },
                '@media screen and (max-height: 800px)': {
                  marginTop: '0',
                  fontSize: '0.8em',
                  marginBottom: '9em',
                },
                '@media screen and (max-width: 450px)': {
                  marginBottom: '4.5em',
                  fontSize: '0.8em',
                },
              }}
            >
              <LoadingButton
                className="btn"
                type="button"
                onClick={handleSignUp}
                variant="contained"
                disabled={disabled}
                loading={loading}
                sx={{
                  ':disabled': { backgroundColor: 'gray', color: '#000' },
                  margin: '0.2rem',
                  color: '#fff',
                  backgroundColor: '#2604ffb1',
                  fontSize: '0.9em',
                  width: '100%',
                  gap: '.5em',
                  // padding: '.1em',
                  height: '3em',
                  fontFamily: 'Verdana, Arial, sans-serif',
                }}
              >
                Sign Up
              </LoadingButton>
              <Button
                className="btn1"
                onClick={() => navigate('/')}
                variant="contained"
                sx={{
                  margin: '0.2rem',
                  width: '100%',
                  height: '3em',
                  color: 'white',
                  fontSize: '0.9em',
                  backgroundColor: '#3a4a5b',
                  borderColor: 'white',
                  fontFamily: 'Verdana, Arial, sans-serif',
                }}
              >
                Go Back
              </Button>
            </Container>
          </Container>
        </Container>
      </div>
    </div>
  );
};

export default Register;
