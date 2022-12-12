import React from 'react';

import { Modules } from '../../Interfaces/ICluster';

import './network.css';

const Visualizer = (props: Modules) => {
  return (
    <div className="kubeView">
      <iframe
        src={`http://35.230.55.147/80`}
        height="800px"
        width="70%"
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default Visualizer;
