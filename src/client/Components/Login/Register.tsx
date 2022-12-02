import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../Queries';
import { Container, Button, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const Register = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const disabled =
    !fields.firstName ||
    !fields.lastName ||
    !fields.username ||
    !fields.password;

  const handleSignUp = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await registerUser({ ...fields });
      // console.log(response, 'OUR RESPONSE');
      if (response.data.userId) navigate('/home');
      setLoading(false);
    } catch (error: any) {
      // console.log('Signup failed', error.response);
      setError(error.response.data.message);
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
    // console.log(fields);
  };

  // when click on enter key, invoke signup func
  const handleEnterKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') {
      // console.log('Enter key pressed');
      if (disabled) return;
      handleSignUp();
    }
  };
  return (
    <Container
      sx={{
        height: '100vh',
        minWidth: '100%',
        justifyContent: 'center',
        display: 'flex',
        direction: 'column',
        textAlign: 'center',
        alignItems: 'center',
        backgroundSize: 'contain',
        bgColor: '#3a4a5b',
      }}
      className="backdrop"
    >
      <Container
        maxWidth="sm"
        className="login-container"
        sx={{
          width: '40%',
          minWidth: '300px',
          opacity: '95%',
          direction: 'column',
          textAlign: 'center',
          color: '#3a4a5b',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '1.5rem',
          borderRadius: '2%',
        }}
      >
        <div>
          <h2>VaaS Registration</h2>
          {error && <span style={{ color: 'red' }}>{error}</span>}
        </div>
        <TextField
          id="firstName-input"
          label="Firstname"
          type="string"
          size="small"
          variant="outlined"
          margin="dense"
          name="firstName"
          value={fields.firstName}
          onKeyDown={handleEnterKeyDown}
          onChange={(e) => handleChange(e)}
        />
        <TextField
          id="lastName-input"
          label="lastName"
          type="string"
          size="small"
          variant="outlined"
          margin="dense"
          name="lastName"
          value={fields.lastName}
          onKeyDown={handleEnterKeyDown}
          onChange={(e) => handleChange(e)}
        />
        <TextField
          id="register-username-input"
          label="username"
          type="username"
          size="small"
          autoComplete="current-username"
          variant="outlined"
          margin="dense"
          name="username"
          value={fields.username}
          onKeyDown={handleEnterKeyDown}
          onChange={(e) => handleChange(e)}
        />
        <TextField
          id="register-password-input"
          label="password"
          type="password"
          size="small"
          autoComplete="current-password"
          variant="outlined"
          margin="dense"
          name="password"
          value={fields.password}
          onKeyDown={handleEnterKeyDown}
          onChange={(e) => handleChange(e)}
        />
        <Container
          id="buttonContainer"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '.5em',
            padding: '.5em',
          }}
        >
          <Button
            onClick={() => navigate('/')}
            variant="contained"
            sx={{
              color: 'white',
              backgroundColor: '#3a4a5b',
              borderColor: 'white',
            }}
          >
            Go Back
          </Button>
          <LoadingButton
            onClick={handleSignUp}
            variant="contained"
            sx={{
              color: 'white',
              backgroundColor: '#3a4a5b',
              borderColor: 'white',
            }}
            type="button"
            disabled={disabled}
            loading={loading}
          >
            Sign Up
          </LoadingButton>
        </Container>
      </Container>
    </Container>
  );
};

export default Register;
