import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modules } from '../../Interfaces/ICluster';
import { Delete, Get, Post } from '../../Services';
import { apiRoute } from '../../utils';
import { useLocation } from 'react-router-dom';
import { Box, Button, FormControl, NativeSelect } from '@mui/material';

const grafanaIP = import.meta.env.VITE_GRAFANA_IP;

const Charts = (props: Modules) => {
  const { state }: any = useLocation();
  const [id] = useState(props.id || state[0]);
  const grafIP = '34.168.31.129';
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
  const dashboardIDs = {
    NEUSECluster: '2WSgtZFVz',
    NEUSENode: 'oHIRtWF4z',
  };
  const [dashboard, setDashboard] = useState('2WSgtZFVz');
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
            <option key={1} value="NEUSECluster">
              {'Node Exporter USE Cluster'}
            </option>
            <option key={2} value="NEUSENode">
              {'Node Exporter USE Node'}
            </option>
          </NativeSelect>
        </FormControl>
      </Box>
      {/* iframe for  node exporter use method node*/}
      {dashboard && (
        <iframe
          src={`http://${grafIP}/d/${dashboard}/?&kiosk`}
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
