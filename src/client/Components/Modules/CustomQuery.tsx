import React, { useEffect, useState } from 'react';
import customMetric from '../../Queries/Custom';
import { Modules } from '../../Interfaces/ICluster';
import loadable from '@loadable/component';
import { Container, TextField, Button } from '@mui/material';

const CustomQuery = (props: Modules) => {

  return (
    //simply render in grafana iframe for custom prom querries and visualization along with dashboard CRUD functionality
    <div className="iframeDiv">
      <iframe
        // src={`http://${grafIP}/d/${dashboard}/`}
        src="http://35.199.145.18/dashboard/new?orgId=1&edit/?&kiosk=tv"
        height="1000px"
        width="1200px"
        className="custom-graf"
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default CustomQuery;
