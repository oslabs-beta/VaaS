import React from 'react';
// import { Box } from '@mui/material';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';

export default function Visualizer(props: {
  handleVisualizerClose: any;
  customBox: any;
  dbData?: any;
}) {
  const { state } = useLocation();
  const urlOrigin = props.dbData || state[0];
  console.log(props.dbData, 'props.dataDATTAAAAA');
  return (
    <Box className="customBox" sx={props.customBox}>
      <div className="renderCustom">
        <button className="closeButton" onClick={props.handleVisualizerClose}>
          {'Close Visualizer'}
        </button>
        <iframe
          src={`${urlOrigin.kubeview_url}`}
          height="800px"
          width="70%"
          frameBorder="0"
          className="custom-graf"
        ></iframe>
      </div>
    </Box>
  );
}
