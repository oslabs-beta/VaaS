import React, { useState, useEffect } from 'react';
import { Modules } from '../../Interfaces/ICluster';
import './styles.css';

import OpenFaaS from '../Modules/OpenFaaS';
import Visualizer from '../Modules/Visualizer';
import CustomQuery from '../Modules/CustomQuery';
import { Container } from '@mui/system';
import Card from '@mui/material/Card';


const Module = (props: Modules) => {
  const [faas, setFaaS] = useState(true);
  const [visualizer, setVisualizer] = useState(false);
  const [custom, setCustom] = useState(false);

  return (
    <Container component={Card} sx={{
      height: '100%',
      minWidth: '100%',
      justifyContent: 'left',
      display: 'flex',
      direction: 'column',
      textAlign: 'left',
      backgroundSize: 'contain',
      marginBottom: '0.5rem',
      backgroundImage: "linear-gradient(#1f3a4b, #AFAFAF)"
    }} id="cluster-card">
      {faas && <OpenFaaS id={props.id} />}
      {visualizer && <Visualizer id={props.id} />}
      {custom && <CustomQuery id={props.id} />}
    </Container>
  );
};

export default Module;
