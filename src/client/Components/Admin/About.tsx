import React from 'react';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import './styles.css';
// Styles
const containerStyle = {
  width: '350px',
  marginTop: '30px',
};

const buttonStyle = {
  background: '#858585',
  borderRadius: '5px',
  marginBottom: '20px',
  width: '100%',
  fontSize: '15px',
  '&:hover': { background: '#0f9595' },
};

const About = (/*props: { openAboutPage: any }*/) => {
  return (
    <Box
      id="tenOptions"
      sx={{
        color: '#f5f5f5',
        height: '600px',
        backgroundColor: '#0b171e',
        boxShadow: '1px 1px 10px .5px rgba(198, 195, 195, 0.5)',
        borderRadius: '10px',
        marginBottom: '20px',
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '350px',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
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
          <h2 id="developed">Developed by:</h2>
          <p>Brandon Muniz-Rosado</p>
          <p>Christopher Tenorio</p>
          <p>Johanna Merluza</p>
          <p>Steven Tong</p>
          <p>Terrence Granger</p>
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
