import React, { useState, useEffect } from 'react';
import './CardsStyles.css';
import { NavLink } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { Modules } from 'src/client/Interfaces';
import Button from '@mui/material/Button';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import ViewInAr from '@mui/icons-material/ViewInAr';
import Modal from '@mui/material/Modal';
import { Visualizer, Custom } from '../Modules';
import QueryStats from '@mui/icons-material/QueryStats';
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined';
import FunctionsOutlined from '@mui/icons-material/Functions';
import AttachMoneyOutlined from '@mui/icons-material/AttachMoney';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ModuleSidebar = (props: Modules) => {
  const { state }: any = useLocation();
  const [id] = useState(props.id || state[0]._id);
  const [open, setOpen] = useState(true);
  const [currModal, setCurrModal] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [btnText, setBtnText] = useState('Collapse');
  const [faas, setFaaS] = useState(true);
  const [currentModule, setCurrentModule] = useState('module');
  const [functionCost, setFunctionCost] = useState(false);
  const [alert, setAlert] = useState(false);
  const [charts, setCharts] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const toggleOpen = () => {
    setOpen(!open);
    if (btnText === 'Collapse') {
      setBtnText('Expand');
    } else setBtnText('Collapse');
  };

  useEffect(() => {
    if (!props.nested) {
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
    <div className={open ? 'ModuleSidenav' : 'ModuleSidenavClosed'}>
      <div className="sidebarMenu">
        <div className="menuCollapse">
          <button
            className={open ? 'closeBtn' : 'openBtn'}
            onClick={toggleOpen}
          >
            {open ? (
              <KeyboardDoubleArrowLeftIcon />
            ) : (
              <KeyboardDoubleArrowRightIcon />
            )}
          </button>
        </div>
        <div className={open ? 'menuButtons' : 'menuButtonsClosed'}>
          <Button
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleChartsButton}
          >
            <AnalyticsOutlinedIcon />
            Dashboards
          </Button>
          <Button
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={() => {
              setCurrModal('visualizer');
              setOpenModal(true);
            }}
          >
            <ViewInAr />
            Cluster Map
          </Button>
          <Button
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={() => {
              setCurrModal('custom');
              setOpenModal(true);
            }}
          >
            <QueryStats />
            Queries
          </Button>
          <Button
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleAlertButton}
          >
            <NotificationImportantOutlinedIcon />
            Alerts
          </Button>
          <Button
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleFaaSButton}
          >
            <FunctionsOutlined />
            OpenFaas
          </Button>
          <Button
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleFunctionCostButton}
          >
            <AttachMoneyOutlined />
            OpenFaas Cost
          </Button>
          <Button
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleFunctionCostButton}
          >
            <InfoOutlinedIcon />
            About
          </Button>
        </div>
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

export default ModuleSidebar;
