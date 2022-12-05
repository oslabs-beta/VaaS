import React from 'react';

import { Modules } from '../../Interfaces/ICluster';

import './network.css';

const Visualizer = (props: Modules) => {
  return (
    <iframe
      src={`http://35.230.55.147/80`}
      height="500px"
      width="100%"
      frameBorder="0"
    ></iframe>
  );
};

export default Visualizer;
