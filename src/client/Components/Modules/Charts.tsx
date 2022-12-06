import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modules } from '../../Interfaces/ICluster';
import { Delete, Get, Post } from '../../Services';
import { apiRoute } from '../../utils';
import { useLocation } from 'react-router-dom';
import { Box, Button, FormControl, NativeSelect } from '@mui/material';
import { useStore, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';

const grafanaIP = import.meta.env.VITE_GRAFANA_IP;

const Charts = (props: Modules) => {
  const { state }: any = useLocation();
  const [open, setOpen] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);
  const [category, setCategory] = useState('');
  const [dashboardObj, setDashboardObj] = useState({});
  const [dashboard, setDashboard] = useState('');
  // const handleOpen = (e: any) => {
  //   setOpen(true);
  //   setCategory(e.target.getAttribute('data-value'));
  //   setDashboardObj(matchObj[category]);
  // };
  const handleClose = () => setOpen(false);
  const handleCloseSecond = () => setOpenSecond(false);
  // const darkMode = useSelector((state: any) => state.DarkMode);
  // console.log('IS THIS DARK MODE? ', darkMode);
  // // get user from store
  // const user: any = useSelector((state: any) => state.user);
  // console.log('THIS IS USELOCATION STATE user ', user);
  // const [id] = useState(props.id || state[0]);
  // const id1 = props.id || state[0];
  // console.log('THIS IS USESTATE:', id);
  // console.log('THIS IS NOT USE STATE:', id1);
  // REPLACE GRAFANA IP WITH ONE FROM THE REDUCER
  const grafIP = '35.199.145.18';
  const inputStyle = {
    width: '45%',
    background: 'blue',
  };
  // const dropdownStyle = {
  //   background: 'white',
  //   borderRadius: '5px',
  //   padding: '0.5rem',
  //   marginBottom: '0px',
  //   width: '100%',
  //   fontSize: '10px',
  // };
  const computingDashboard = {
    Cluster: 'efa86fd1d0c121a26444b636a3f509a8',
    Nodes: 'a87fb0d919ec0ea5f6543124e16c42a5',
    Workloads: '200ac8fdbfbb74b39aff88118e4d1c2c',
    Pods: '85a562078cdf77779eaa1add43ccec1e',
  };
  const networkingDashboard = {
    Cluster: 'ff635a025bcfea7bc3dd4f508990a3e9',
    Namespaces: 'bbb2a765a623ae38130206c7d94a160f',
    Workloads: '728bf77cc1166d2f3133bf25846876cc',
    Pods: '7a18067ce943a40ae25454675c19ff5c',
  };
  const isolatedDashboard = {
    Cluster: 'efa86fd1d0c121a26444b636a3f509a8',
    Nodes: 'a87fb0d919ec0ea5f6543124e16c42a5',
    Workloads: 'a164a7f0339f99e89cea5cb47e9be617',
    Pods: '6581e46e4e5c7ba40a07646395ef7b23',
  };
  const overviewDashboard = {
    Kubelet: '3138fa155d5915769fbded898ac09fd9',
    'USE/NODE': 'Qe5ZDfF4z',
    'USE/CLUSTER': 'rrcZvfFVk',
    'Node Exporter': '8A5ZvfF4z',
  };
  const coreDashboard = {
    'API Server': '09ec8aa1e996d6ffcd6817bbaff4db1b',
    etcd: 'c2f4e12cdf69feb95caa41a5a1b423d9',
    Scheduler: '2e6b6a3b4bddf1427b3a55aa1311c656',
    'Controller Manager': '72e0e05bef5099e5f049b05fdc429ed4',
  };
  // const matchObj = {
  //   computing: computingDashboard,
  // };
  const handleOpen = (e: any) => {
    setCategory(e.target.getAttribute('data-value'));
    console.log(category);
    console.log(e.target.getAttribute('data-value'));
    switch (e.target.getAttribute('data-value')) {
      case 'computing': {
        setDashboardObj(computingDashboard);
        break;
      }
      case 'networking': {
        setDashboardObj(networkingDashboard);
        break;
      }
      case 'isolated': {
        setDashboardObj(isolatedDashboard);
        break;
      }
      case 'overview': {
        setDashboardObj(overviewDashboard);
        break;
      }
      case 'core': {
        setDashboardObj(coreDashboard);
        break;
      }
    }
    setOpen(true);
  };
  const handleDashboard = (e: any) => {
    setOpenSecond(true);
    setDashboard(e.target.getAttribute('data-value'));
  };
  // const dashboardIDs = {
  //   NEUSECluster: '2WSgtZFVz',
  //   NEUSENode: 'oHIRtWF4z',
  //   NEFull: 'rYdddlPWk',
  //   Deployments: 'kbmUTOFVk',
  //   ServerMetrics: 'MWxrodK4z',
  //   NEUSEPod: 'dpI6oOK4k',
  // };
  // const [dashboard, setDashboard] = useState('');
  // const handleDashboardSelect = (e: ChangeEvent<HTMLSelectElement>) => {
  //   setDashboard(dashboardIDs[e.target.value]);
  // };
  // useEffect(() => {
  //   console.log('placeholder');
  // }, []);
  // console.log(state);
  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#2704FF',
    border: '5px solid #101216',
    borderRadius: '10px',
    boxShadow: 24,
    p: 7,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };
  const style2 = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#2704FF',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };
  return (
    <div className="chartsBackground">
      <div className="categoryList">
        <div className="category" data-value="computing" onClick={handleOpen}>
          Computing
        </div>
        <div className="category" data-value="networking" onClick={handleOpen}>
          Networking
        </div>
        <div className="category" data-value="isolated" onClick={handleOpen}>
          Isolated
        </div>
        <div className="category" data-value="overview" onClick={handleOpen}>
          Overview
        </div>
        <div className="category" data-value="core" onClick={handleOpen}>
          Core
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div
            data-value={Object.values(dashboardObj)[0]}
            onClick={handleDashboard}
            className="dashboard"
          >
            {Object.keys(dashboardObj)[0]}
          </div>
          <div
            data-value={Object.values(dashboardObj)[1]}
            onClick={handleDashboard}
            className="dashboard"
          >
            {Object.keys(dashboardObj)[1]}
          </div>
          <div
            data-value={Object.values(dashboardObj)[2]}
            onClick={handleDashboard}
            className="dashboard"
          >
            {Object.keys(dashboardObj)[2]}
          </div>
          <div
            data-value={Object.values(dashboardObj)[3]}
            onClick={handleDashboard}
            className="dashboard"
          >
            {Object.keys(dashboardObj)[3]}
          </div>
        </Box>
      </Modal>
      <Modal
        open={openSecond}
        onClose={handleCloseSecond}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="modal-2"
      >
        <Box className="modal-2-box" sx={style2}>
          <div className="renderDashboard">
            <iframe
              src={`http://${grafIP}/d/${dashboard}/?&kiosk=tv`}
              height="1000px"
              width="1250px"
              frameBorder="0"
            ></iframe>
          </div>
          <>
            <Button onClick={handleCloseSecond}>{'CLOSE GRAPH'}</Button>
          </>
        </Box>
      </Modal>
      {/* <Box sx={inputStyle}>
        <FormControl fullWidth sx={dropdownStyle}>
          <NativeSelect onChange={handleDashboardSelect}>
            <option key={1} value="NEFull">
              {'Node Exporter - Full'}
            </option>
            <option key={2} value="NEUSECluster">
              {'Node Exporter - Cluster'}
            </option>
            <option key={3} value="NEUSENode">
              {'Node Exporter - Nodes'}
            </option>
            <option key={4} value="Deployments">
              {'Node Exporter - Deployments'}
            </option>
            <option key={5} value="NEUSEPod">
              {'Node Exporter - Pods'}
            </option>
            <option key={6} value="ServerMetrics">
              {'Node Exporter - Server Metrics'}
            </option>
            <option key={7} value="NEnodes">
              {'Node Exporter - Nodes'}
            </option>
          </NativeSelect>
        </FormControl>
      </Box> */}
      {/* iframe for  node exporter use method node*/}
      {/* {dashboard && (
        <iframe
          src={`http://${grafIP}/d/${dashboard}/?&kiosk=tv`}
          height="1600px"
          width="100%"
          frameBorder="0"
        ></iframe>
      )} */}
      {/* iframe for node exporter use method cluster */}
      {/* <iframe
        src="http://34.83.254.250/d/oHIRtWF4z/?&kiosk"
        height="1500px"
        width="100%"
        frameBorder="0"

        
      ></iframe> */}
    </div>
  );
};

export default Charts;
