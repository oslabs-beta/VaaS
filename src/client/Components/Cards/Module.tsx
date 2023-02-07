import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { OpenFaaS, Alert, Charts, FunctionCost } from '../Modules/index';
import NavBar from '../Home/NavBar';
import { Modules } from '../../Interfaces/ICluster';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import Insights from '@mui/icons-material/Insights';
import AddAlert from '@mui/icons-material/AddAlert';
import ViewInAr from '@mui/icons-material/ViewInAr';
import QueryStats from '@mui/icons-material/QueryStats';
import Functions from '@mui/icons-material/Functions';
import AttachMoney from '@mui/icons-material/AttachMoney';
import CostMain from '../Modules/CostCalc/CostMain';
// import Close from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
// import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

import { Visualizer, Custom } from '../Modules';
import './CardsStyles.css';
import '../Modules/network.css';

// needs to be chnaged to redux, under UI reducer ?
const Module = (props: Modules) => {
  const { state }: any = useLocation();
  if (state === null) return <Navigate to={'/home'} />;
  const navigate = useNavigate();
  const [id] = useState(props.id || state[0]._id);
  // Hooks used to indicate which module should be rendered in
  const [currentModule, setCurrentModule] = useState('module');
  const [open, setOpen] = useState(false);
  const [btnText, setBtnText] = useState('Collapse');
  const [faas, setFaaS] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [currModal, setCurrModal] = useState('');
  const [functionCost, setFunctionCost] = useState(false);
  const [alert, setAlert] = useState(false);
  const [charts, setCharts] = useState(false);
  const [kubacus, setKubacus] = useState(false);
  // Handlers for modals
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const toggleOpen = () => {
    setOpen(!open);
    if (btnText === 'Collapse') {
      setBtnText('Expand');
    } else setBtnText('Collapse');
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
  // const [buttonStyle, setButtonStyle] = useState(
  //   props.isDark
  //     ? {
  //         color: '#c0c0c0',
  //         width: '1px',
  //       }
  //     : {
  //         color: 'white',
  //         width: '1px',
  //       }
  // );

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
      // setButtonStyle({
      //   ...buttonStyle,
      //   color: '#3a4a5b',
      // });
      if (state) {
        switch (state[1]) {
          case 'faas':
            setFaaS(true);
            setFunctionCost(false);
            setCharts(false);
            setAlert(false);
            setKubacus(false);
            break;
          case 'visualizer':
            setFaaS(false);
            setFunctionCost(false);
            setCharts(false);
            setAlert(false);
            setKubacus(false);
            break;
          case 'custom':
            setFaaS(false);
            setFunctionCost(false);
            setCharts(false);
            setAlert(false);
            setKubacus(false);
            break;
          case 'charts':
            setFaaS(false);
            setFunctionCost(false);
            setCharts(true);
            setAlert(false);
            setKubacus(false);
            break;
          case 'alert':
            setAlert(true);
            setFaaS(false);
            setFunctionCost(false);
            setCharts(false);
            setKubacus(false);
            break;
          case 'functionCost':
            setAlert(false);
            setFaaS(false);
            setFunctionCost(true);
            setCharts(false);
            setKubacus(false);
            break;
          case 'kubacus':
            setAlert(false);
            setFaaS(false);
            setFunctionCost(false);
            setCharts(false);
            setKubacus(true);
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
    setKubacus(false);
  };

  const handleChartsButton = () => {
    setFaaS(false);
    setCharts(true);
    setFunctionCost(false);
    setCurrentModule('charts');
    setAlert(false);
    setKubacus(false);
  };

  const handleAlertButton = () => {
    setFaaS(false);
    setCurrentModule('alert');
    setCharts(false);
    setFunctionCost(false);
    setAlert(true);
    setKubacus(false);
  };

  const handleFunctionCostButton = () => {
    setFaaS(false);
    setCharts(false);
    setFunctionCost(true);
    setAlert(false);
    setKubacus(false);
    setCurrentModule('functionCost');
  };
  const handleKubacusButton = () => {
    setFaaS(false);
    setCharts(false);
    setFunctionCost(false);
    setAlert(false);
    setKubacus(true);
    setCurrentModule('kubacus');
  };
  const customBox = {
    overflow: 'scroll',
    maxHeight: '100%',
    display: 'inline',
  };

  const buttonStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    backgroundColor: '#061320',
    marginTop: '8px',
    marginBottom: '8px',
    fontSize: '0.9rem',
    color: '#f5f5f5',
    // width: '100%',
    '&:hover': { color: '#0f9595' },
  };

  const iconStyle = {
    marginRight: '10px',
  };

  return (
    <div>
      <header>
        <NavBar
          open={() => {
            setOpen(true);
          }}
        />
      </header>
      <section className="mainWrapper">
        <div className={open ? 'ModuleSidenav' : 'ModuleSidenavClosed'}>
          <div className="sidebarMenu">
            <div className="menuCollapse">
              <button className="closeBtn" onClick={toggleOpen}>
                {open && <KeyboardDoubleArrowLeftIcon fontSize="large" />}
              </button>
            </div>
            <div className={open ? 'menuButtons' : 'menuButtonsClosed'}>
              <Button
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  backgroundColor: '#061320',
                  marginTop: '15px',
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  color: '#f5f5f5',
                  '&:hover': { color: '#0f9595' },
                }}
                variant="text"
                className="module-button"
                onClick={() => navigate('/home')}
              >
                <HomeIcon sx={iconStyle} />
                Home
              </Button>

              <Button
                sx={buttonStyle}
                variant="text"
                className="module-button"
                onClick={handleChartsButton}
              >
                <Insights sx={iconStyle} />
                Dashboards
              </Button>

              <Button
                sx={buttonStyle}
                variant="text"
                className="module-button"
                onClick={() => {
                  setCurrModal('visualizer');
                  setOpenModal(true);
                }}
              >
                <ViewInAr sx={iconStyle} />
                Cluster Map
              </Button>

              <Button
                sx={buttonStyle}
                variant="text"
                className="module-button"
                onClick={() => {
                  setCurrModal('custom');
                  setOpenModal(true);
                }}
              >
                <QueryStats sx={iconStyle} />
                Queries
              </Button>

              <Button
                sx={buttonStyle}
                variant="text"
                className="module-button"
                onClick={handleAlertButton}
              >
                <AddAlert sx={iconStyle} />
                Alerts
              </Button>

              <Button
                sx={buttonStyle}
                variant="text"
                className="module-button"
                onClick={handleFaaSButton}
              >
                <Functions sx={iconStyle} />
                OpenFaas
              </Button>

              <Button
                sx={buttonStyle}
                variant="text"
                className="module-button"
                onClick={handleFunctionCostButton}
              >
                <AttachMoney sx={iconStyle} />
                OpenFaas Cost
              </Button>

              <Button
                sx={buttonStyle}
                variant="text"
                className="module-button"
                onClick={handleKubacusButton}
              >
                <AttachMoney sx={iconStyle} />
                Kubacus
              </Button>

              {/* {!props.nested && ( )} */}
            </div>
          </div>
        </div>
        <section className="rightContent">
          <div className="clusterTitle">
            {faas && (
              <div className="Header-Bar-Title">OPENFAAS: {state[0].name}</div>
            )}
            {charts && (
              <div className="Header-Bar-Title">
                Dashboards: {state[0].name}
              </div>
            )}
            {functionCost && (
              <div className="Header-Bar-Title">FAAS COST: {state[0].name}</div>
            )}
            {alert && (
              <div className="Header-Bar-Title">ALERTS: {state[0].name}</div>
            )}
          </div>
          <div id="module-content">
            {faas && (
              <OpenFaaS isDark={props.isDark} id={id} nested={props.nested} />
            )}
            {charts && <Charts id={id} nested={props.nested} />}
            {functionCost && (
              <FunctionCost
                isDark={props.isDark}
                id={id}
                nested={props.nested}
              />
            )}
            {kubacus && <CostMain />}
            {alert && <Alert id={id} nested={props.nested} />}
          </div>
        </section>
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
      </section>
    </div>
  );
};

export default Module;
