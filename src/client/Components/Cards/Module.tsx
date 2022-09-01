import React, { useState, useEffect } from 'react';
import { Modules } from '../../Interfaces/ICluster';
import './styles.css';
import OpenFaaS from '../Modules/OpenFaaS';
import Visualizer from '../Modules/Visualizer';
import CustomQuery from '../Modules/CustomQuery';
import NavBar from '../Home/NavBar';
import Container from '@mui/system/Container';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useNavigate, useLocation } from 'react-router-dom';

const Module = (props: Modules) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [faas, setFaaS] = useState(true);
  const [visualizer, setVisualizer] = useState(false);
  const [custom, setCustom] = useState(false);
  const [style, setStyle] = useState({
    color: "white",
    minHeight: '143px',
    minWidth: '100%',
    display: 'flex',
    textAlign: 'left',
    marginBottom: '0.5rem',
    backgroundImage: "linear-gradient(#1f3a4b, #AFAFAF)"
  });

  useEffect(() => {
    if (!props.nested) {
      setStyle({
        color: 'black',
        minHeight: '58vw',
        minWidth: '100%',
        display: 'flex',
        textAlign: 'left',
        marginBottom: '0.5rem',
        backgroundImage: ""
      });
    }
  }, []);

  return (
    <div>
      <Container component={Card} sx={style} className="module-container">
        <div className='Module-top-row'>
          <div className='module-title noselect'>
            {faas && <div>OpenFaaS</div>}
            {visualizer && <div>Visualizer</div>}
            {custom && <div>Run Custom Query</div>}
          </div>
          {props.nested && <Button 
            sx={{
              color: "white",
              marginRight: '-9px'
            }}
            variant="text"
            id="basic-button"
            className='full-screen-button'
            onClick={()=> navigate('/module', { state: props.id })}
          >
            <FullscreenIcon />
          </Button>}
          {!props.nested && <Button 
            sx={{
              color: "#3a4a5b",
              marginRight: '-9px'
            }}
            variant="text"
            id="basic-button"
            className='full-screen-button'
            onClick={()=> navigate('/home', { state: props.id })}
          >
            <FullscreenExitIcon />
          </Button>}
        </div>
        <div id='module-content'>
          Cluster ID: {props.id}
          {location.pathname === '/module' && state as JSX.Element}
          {faas && <OpenFaaS id={props.id} />}
          {visualizer && <Visualizer id={props.id} />}
          {custom && <CustomQuery id={props.id} />}
        </div>
      </Container>
      {!props.nested && <NavBar />}
    </div>
  );
};

export default Module;
