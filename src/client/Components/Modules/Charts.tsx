import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modules } from '../../Interfaces/ICluster';
import { Delete, Get, Post } from '../../Services';
import { apiRoute } from '../../utils';
import { useLocation } from 'react-router-dom';
import { Box, Button, FormControl, NativeSelect } from '@mui/material';
import { useStore, useSelector } from 'react-redux';

const grafanaIP = import.meta.env.VITE_GRAFANA_IP;

const Charts = (props: Modules) => {
  const { state }: any = useLocation();
  const darkMode = useSelector((state: any) => state.DarkMode);
  console.log('IS THIS DARK MODE? ', darkMode);
  // get user from store
  const user: any = useSelector((state: any) => state.user);
  console.log('THIS IS USELOCATION STATE user ', user);
  const [id] = useState(props.id || state[0]);
  const id1 = props.id || state[0];
  console.log('THIS IS USESTATE:', id);
  console.log('THIS IS NOT USE STATE:', id1);
  // REPLACE GRAFANA IP WITH ONE FROM THE REDUCER
  const grafIP = '35.199.145.18';
  const inputStyle = {
    width: '45%',
    background: 'blue',
  };
  const dropdownStyle = {
    background: 'white',
    borderRadius: '5px',
    padding: '0.5rem',
    marginBottom: '0px',
    width: '100%',
    fontSize: '10px',
  };
  // ! These dashboard IDs change for each user, we shouldn't be hardcoding these
  const dashboardIDs = {
    NEUSECluster: 'rrcZvfFVk',
    NEUSENode: 'Qe5ZDfF4z',
    NEFull: 'rYdddlPWk',
    Deployments: 'kbmUTOFVk',
    ServerMetrics: 'MWxrodK4z',
    NEUSEPod: 'dpI6oOK4k',
    NEnodes: '8A5ZvfF4z',
  };
  const [dashboard, setDashboard] = useState('rYdddlPWk');
  const handleDashboardSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setDashboard(dashboardIDs[e.target.value]);
  };
  useEffect(() => {
    console.log('placeholder');
  }, []);
  console.log(state);

  return (
    <div>
      <Box sx={inputStyle}>
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
      </Box>
      {/* iframe for  node exporter use method node*/}
      {dashboard && (
        <iframe
          src={`http://${grafIP}/d/${dashboard}/?&kiosk=tv`}
          height="1600px"
          width="100%"
          frameBorder="0"
        ></iframe>
      )}
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
