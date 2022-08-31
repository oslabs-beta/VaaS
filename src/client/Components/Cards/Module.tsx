import React, { useState, useEffect } from 'react';
import { clusterMetric, nodeMetric } from '../../Queries';
import { Modules } from '../../Interfaces/ICluster';

import './styles.css';
import { Put } from '../../Services';
import { apiRoute } from '../../utils';
import OpenFaaS from '../Modules/OpenFaaS';
import { Container, Box } from '@mui/system';
import Card from '@mui/material/Card';


const Module = (props: Modules) => {
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
      <OpenFaaS />
    </Container>
  );
};

export default Module;
