import React, { useState, useEffect } from 'react';
import { Modules } from '../../Interfaces/ICluster';
import './styles.css';
import { Container } from '@mui/system';
import Card from '@mui/material/Card';


const OpenFaaS = (props: Modules) => {

  return (
    <Container component={Card} sx={{
      height: '33vh',
      minWidth: '100%',
      justifyContent: 'left',
      display: 'flex',
      direction: 'column',
      textAlign: 'left',
      backgroundSize: 'contain',
      bgcolor: '#3a4a5b',
      marginBottom: '0.5rem',
      backgroundImage: "linear-gradient(#1f3a4b, #AFAFAF)"
    }} id="cluster-card">
      <div className='faas-title'>
        OpenFaaS
      </div>
    </Container>
  );
};

export default OpenFaaS;
