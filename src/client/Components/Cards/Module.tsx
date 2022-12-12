import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OpenFaaS from '../Modules/OpenFaaS';
import Visualizer from '../Modules/Visualizer';
import CustomQuery from '../Modules/CustomQuery';
import Alert from '../Modules/Alert';
import Charts from '../Modules/Charts';
import FunctionCost from '../Modules/FunctionCost';
import NavBar from '../Home/NavBar';
import { Modules } from '../../Interfaces/ICluster';
import Container from '@mui/system/Container';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import GrainIcon from '@mui/icons-material/Grain';
import DataObjectIcon from '@mui/icons-material/DataObject';
import FunctionsIcon from '@mui/icons-material/Functions';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import { Box, FormControl, NativeSelect } from '@mui/material';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import './styles.css';
import { Terminal } from '@mui/icons-material';

// needs to be chnaged to redux, under UI reducer ?
const Module = (props: Modules) => {
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const [faas, setFaaS] = useState(true);

  const [custom, setCustom] = useState(false);
  const [visualizer, setVisualizer] = useState(false);

  const [openCustom, setOpenCustom] = useState(false);
  const [openVisualizer, setOpenVisualizer] = useState(false);

  const handleCustomOpen = () => setOpenCustom(true);
  const handleCustomClose = () => setOpenCustom(false);
  const handleVisualizerOpen = () => setOpenVisualizer(true);
  const handleVisualizerClose = () => setOpenVisualizer(false);

  const [functionCost, setFunctionCost] = useState(false);
  const [alert, setAlert] = useState(false);
  const [charts, setCharts] = useState(false);
  const [currentModule, setCurrentModule] = useState('module');
  const [id] = useState(props.id || state[0]);
  console.log('This is props from Module.tsx:', props);
  const [style, setStyle] = useState(
    props.isDark
      ? {
          color: '#c0c0c0',
          minHeight: '100%',
          minWidth: '100%',
          display: 'flex',
          textAlign: 'left',
          backgroundImage: 'linear-gradient(#2f3136, #7f7f7f)',
          overflow: 'auto',
        }
      : {
          color: 'white',
          minHeight: '100%',
          minWidth: '100%',
          display: 'flex',
          textAlign: 'left',
          backgroundImage: 'linear-gradient(#1f3a4b, #AFAFAF)',
          overflow: 'auto',
        }
  );
  const [buttonStyle, setButtonStyle] = useState(
    props.isDark
      ? {
          color: '#c0c0c0',
          width: '1px',
        }
      : {
          color: 'white',
          width: '1px',
        }
  );

  useEffect(() => {
    if (!props.nested) {
      setStyle({
        color: 'black',
        minHeight: '92vh',
        minWidth: '100%',
        display: 'flex',
        textAlign: 'left',
        backgroundImage: '',
        overflow: 'auto',
      });
      setButtonStyle({
        ...buttonStyle,
        color: '#3a4a5b',
      });
      if (state) {
        switch (state[1]) {
          case 'faas':
            setFaaS(true);
            setVisualizer(false);
            setCustom(false);
            setFunctionCost(false);
            setCharts(false);
            setAlert(false);
            break;
          case 'visualizer':
            setFaaS(false);
            setVisualizer(false);
            setCustom(false);
            setFunctionCost(false);
            setCharts(false);
            setAlert(false);
            break;
          case 'custom':
            setFaaS(false);
            setVisualizer(false);
            setFunctionCost(false);
            setCustom(false);
            setCharts(false);
            setAlert(false);
            break;
          case 'charts':
            setFaaS(false);
            setVisualizer(false);
            setCustom(false);
            setFunctionCost(false);
            setCharts(true);
            setAlert(false);
            break;
          case 'alert':
            setAlert(true);
            setFaaS(false);
            setVisualizer(false);
            setCustom(false);
            setCharts(false);
            break;
          case 'functionCost':
            setAlert(false);
            setFaaS(false);
            setVisualizer(false);
            setCustom(false);
            setFunctionCost(true);
            setCharts(false);
            break;
        }
      }
    }
  }, []);

  const handleFaaSButton = () => {
    setFaaS(true);
    setCurrentModule('faas');
    setVisualizer(false);
    setFunctionCost(false);
    setCustom(false);
    setCharts(false);
    setAlert(false);
  };

  // const handleVisualizerButton = () => {
  //   setFaaS(false);
  //   setVisualizer(false);
  //   setCurrentModule('visualizer');
  //   setCustom(false);
  //   setFunctionCost(false);
  //   setCharts(false);
  //   setAlert(false);
  // };

  // const handleCustomButton = () => {
  //   setFaaS(false);
  //   setVisualizer(false);
  //   setCustom(false);
  //   setCurrentModule('custom');
  //   setFunctionCost(false);
  //   setCharts(false);
  //   setAlert(false);
  // };

  const handleChartsButton = () => {
    setFaaS(false);
    setVisualizer(false);
    setCustom(false);
    setCharts(true);
    setFunctionCost(false);
    setCurrentModule('charts');
    setAlert(false);
  };

  const handleAlertButton = () => {
    setFaaS(false);
    setCurrentModule('alert');
    setVisualizer(false);
    setCustom(false);
    setCharts(false);
    setAlert(true);
  };

  const handleFunctionCostButton = () => {
    console.log('CLICKED');
    setFaaS(false);
    setVisualizer(false);
    setCustom(false);
    setCharts(false);
    setFunctionCost(true);
    setAlert(false);
    setCurrentModule('functionCost');
  };
  const customBox = {
    overflow: 'scroll',
    maxHeight: '100%',
    display: 'inline',
  };
  return (
    <div>
      <NavBar />
      {/* <Container
        component={Card}
        sx={{
          width: '100%',
          height: '100%',
          margin: '0px',
          padding: '0px',
          backgroundColor: '#101216',
        }}
        className="module-container"
      > */}
      <div className="Module-top-row">
        {/* <div className="module-title noselect"> */}
        {faas && <div className="Header-Bar-Title">OPENFAAS</div>}
        {visualizer && <div>VISUALIZER</div>}
        {custom && <div>PROM QUERY</div>}
        {charts && <div className="Header-Bar-Title">CHARTS</div>}
        {functionCost && <div className="Header-Bar-Title">FUNCTION COST</div>}
        {alert && <div className="Header-Bar-Title">ALERT</div>}
        {/* </div> */}
        <Tooltip title="Custom Query">
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleCustomOpen}
          >
            <DataObjectIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Grafana Charts">
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleChartsButton}
          >
            <QueryStatsIcon />
          </Button>
        </Tooltip>
        <Tooltip title="FaaS Queries">
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleFaaSButton}
          >
            <FunctionsIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Function Costs">
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleFunctionCostButton}
          >
            <AttachMoneyIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Open Visualizer">
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleVisualizerOpen}
          >
            <GrainIcon />
          </Button>
        </Tooltip>
        {props.nested && (
          <Button
            sx={{
              ...buttonStyle,
              marginRight: '-9px',
            }}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={() =>
              // console.log('testing full screen')
              navigate('/module', { state: [id, currentModule, true] })
            }
          >
            <FullscreenIcon />
          </Button>
        )}
        <Tooltip title="Alert Manager">
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleAlertButton}
          >
            <AddAlertIcon />
          </Button>
        </Tooltip>
        {!props.nested && (
          <Tooltip title="Exit to Home">
            <Button
              sx={{
                ...buttonStyle,
                marginRight: '-9px',
              }}
              variant="text"
              id="basic-button"
              className="module-button"
              onClick={() => navigate('/home', { state: [id, currentModule] })}
            >
              <FullscreenExitIcon />
            </Button>
          </Tooltip>
        )}
      </div>
      <div id="module-content">
        {custom && (
          <CustomQuery isDark={props.isDark} id={id} nested={props.nested} />
        )}
        {faas && (
          <OpenFaaS isDark={props.isDark} id={id} nested={props.nested} />
        )}
        {charts && <Charts id={id} nested={props.nested} />}
        {functionCost && (
          <FunctionCost isDark={props.isDark} id={id} nested={props.nested} />
        )}
        {visualizer && <Visualizer id={id} nested={props.nested} />}
        {alert && <Alert id={id} nested={props.nested} />}
      </div>
      <Modal
        open={openCustom}
        onClose={handleCustomClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="customBox" sx={customBox}>
          <div className="renderCustom">
            <button className="closeButton" onClick={handleCustomClose}>
              {'Close Query'}
            </button>
            <iframe
              src={'http://35.199.145.18/dashboard/new?orgId=1&edit'}
              height="1000px"
              width="1250px"
              className="custom-graf"
              frameBorder="0"
            ></iframe>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openVisualizer}
        onClose={handleVisualizerClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="customBox" sx={customBox}>
          <div className="renderCustom">
            <button className="closeButton" onClick={handleVisualizerClose}>
              {'Close Visualizer'}
            </button>
            <iframe
              src={`http://35.230.55.147/80`}
              height="800px"
              width="70%"
              frameBorder="0"
              className="custom-graf"
            ></iframe>
          </div>
        </Box>
      </Modal>
      {/* </Container> */}
      <Container
        className="cluster-id"
        sx={{
          color: style.color,
        }}
      ></Container>
      {!props.nested}
    </div>
  );
};

export default Module;
