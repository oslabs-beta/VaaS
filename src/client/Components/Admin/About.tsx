import React from 'react';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import './styles.css';
// Styles
const containerStyle = {
  width: '350px',
  marginTop: '-10px',
};
const textFieldStyle = {
  background: 'blue',
  borderRadius: '5px',
  marginBottom: '0px',
  width: '100%',
  fontSize: '10px',
};
const buttonStyle = {
  background: '#3a4a5b',
  borderRadius: '5px',
  marginBottom: '0px',
  width: '100%',
  fontSize: '10px',
};

const About = (props: { openAboutPage: any }) => {
  return (
    <Box
      id="tenOptions"
      sx={{
        padding: '0px',
        display: 'flex',
        position: 'fixed',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'black',
        borderRadius: '10px',
        color: 'white',
        border: '1px solid black',
        margin: '0.5rem 0rem 0.6rem 0rem',
        fontWeight: 'bold',
        fontFamily: 'Verdana, Arial, sans-serif',
        boxShadow: '1px 1px 10px 5px rgba(248, 245, 245, 0.5)',
        fontSize: '1em',
        width: '600px',
        gap: '.6em',
        height: '800px',
        '@media screen and (max-width: 650px)': {
          maxWidth: '80vw',
          height: '510px',
        },
      }}
    >
      <Container sx={containerStyle}>
        <Button
          variant="contained"
          type="button"
          className="btn"
          sx={buttonStyle}
          onClick={() =>
            window.open('https://vaas.dev/', '_blank', 'noopener,noreferrer')
          }
        >
          Learn more about VaaS
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <h3>Developed by:</h3>
          <p>Brandon Muniz-Rosado</p>
          <p>Christopher Tenario</p>
          <p>Johanna Merluza</p>
          <p>Terrence Granger</p>
          <p>Steven Tong</p>
          <p>Young Kim</p>
          <p>Ahsan Ali </p>
          <p>Rabea Ahmad</p>
          <p>Stephan Chiorean</p>
          <p>Ruqayaah Sabitu</p>
          <p>James Chan</p>
          <p>Jimmy Lim</p>
          <p>Alex Kaneps</p>
          <p>Matthew McGowan</p>
          <p>Vu Duong</p>
          <p>Murad Alqadi</p>
          <p>Kevin Le</p>
          <p>Richard Zhang</p>
          <p>Irvin Ie</p>
        </Box>
      </Container>
    </Box>
  );
};
export default About;
