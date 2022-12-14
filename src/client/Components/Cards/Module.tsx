import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OpenFaaS, Alert, Charts, FunctionCost } from '../Modules/index';
import NavBar from '../Home/NavBar';
import { Modules } from '../../Interfaces/ICluster';
import { Button, Tooltip, Modal } from '@mui/material';
import {
  Insights,
  AddAlert,
  ViewInAr,
  QueryStats,
  Functions,
  AttachMoney,
  Close,
} from '@mui/icons-material';
import { Visualizer, Custom } from '../Modules';
import './styles.css';
import '../Modules/network.css';

// needs to be chnaged to redux, under UI reducer ?
const Module = (props: Modules) => {
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const [id] = useState(props.id || state[0]._id);
  // Hooks used to indicate which module should be rendered in
  const [currentModule, setCurrentModule] = useState('module');
  const [faas, setFaaS] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [currModal, setCurrModal] = useState('');
  const [functionCost, setFunctionCost] = useState(false);
  const [alert, setAlert] = useState(false);
  const [charts, setCharts] = useState(false);
  // Handlers for modals
  const handleCloseModal = () => {
    setOpenModal(false);
  };

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
            setFunctionCost(false);
            setCharts(false);
            setAlert(false);
            break;
          case 'visualizer':
            setFaaS(false);
            setFunctionCost(false);
            setCharts(false);
            setAlert(false);
            break;
          case 'custom':
            setFaaS(false);
            setFunctionCost(false);
            setCharts(false);
            setAlert(false);
            break;
          case 'charts':
            setFaaS(false);
            setFunctionCost(false);
            setCharts(true);
            setAlert(false);
            break;
          case 'alert':
            setAlert(true);
            setFaaS(false);
            setFunctionCost(false);
            setCharts(false);
            break;
          case 'functionCost':
            setAlert(false);
            setFaaS(false);
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
    setFunctionCost(false);
    setCharts(false);
    setAlert(false);
  };

  const handleChartsButton = () => {
    setFaaS(false);
    setCharts(true);
    setFunctionCost(false);
    setCurrentModule('charts');
    setAlert(false);
  };

  const handleAlertButton = () => {
    setFaaS(false);
    setCurrentModule('alert');
    setCharts(false);
    setFunctionCost(false);
    setAlert(true);
  };

  const handleFunctionCostButton = () => {
    setFaaS(false);
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
      <div className="Module-top-row">
        <div>
          {faas && (
            <div className="Header-Bar-Title">OPENFAAS: {state[0].name}</div>
          )}
          {charts && (
            <div className="Header-Bar-Title">GRAPHS: {state[0].name}</div>
          )}
          {functionCost && (
            <div className="Header-Bar-Title">FAAS COST: {state[0].name}</div>
          )}
          {alert && (
            <div className="Header-Bar-Title">ALERTS: {state[0].name}</div>
          )}
        </div>
        <Tooltip title="Graphs">
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleChartsButton}
          >
            <Insights />
          </Button>
        </Tooltip>
        <Tooltip title="Cluster Map">
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={() => {
              setCurrModal('visualizer');
              setOpenModal(true);
            }}
          >
            <ViewInAr />
          </Button>
        </Tooltip>
        <Tooltip title="Queries">
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={() => {
              setCurrModal('custom');
              setOpenModal(true);
            }}
          >
            <QueryStats />
          </Button>
        </Tooltip>
        <Tooltip title="Alerts">
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleAlertButton}
          >
            <AddAlert />
          </Button>
        </Tooltip>
        <Tooltip title="OpenFaaS">
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleFaaSButton}
          >
            <Functions />
          </Button>
        </Tooltip>
        <Tooltip title="FaaS Cost">
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleFunctionCostButton}
          >
            <AttachMoney />
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
              <Close />
            </Button>
          </Tooltip>
        )}
      </div>
      <div id="module-content">
        {faas && (
          <OpenFaaS isDark={props.isDark} id={id} nested={props.nested} />
        )}
        {charts && <Charts id={id} nested={props.nested} />}
        {functionCost && (
          <FunctionCost isDark={props.isDark} id={id} nested={props.nested} />
        )}
        {alert && <Alert id={id} nested={props.nested} />}
      </div>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          {currModal === 'custom' ? (
            <Custom
              handleCustomClose={handleCloseModal}
              customBox={customBox}
            />
          ) : (
            <Visualizer
              handleVisualizerClose={handleCloseModal}
              customBox={customBox}
            />
          )}
        </>
      </Modal>
      {!props.nested}
    </div>
  );
};

export default Module;
