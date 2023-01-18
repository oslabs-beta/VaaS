import React from 'react';
// import { Box } from '@mui/material';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';

const Custom = (props: {
  handleCustomClose: any;
  customBox: any;
  dbData?: any;
}) => {
  const { state }: any = useLocation();
  const urlOrigin = props.dbData || state[0];
  return (
    <Box className="customBox" sx={props.customBox}>
      <div className="renderCustom">
        <button className="closeButton" onClick={props.handleCustomClose}>
          {'Close Query'}
        </button>
        <iframe
          src={`${urlOrigin.grafana_url}/dashboard/new?orgId=1&edit`}
          height="1000px"
          width="1250px"
          className="custom-graf"
          frameBorder="0"
        ></iframe>
      </div>
    </Box>
  );
};

export default Queries;
