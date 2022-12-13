import React from 'react';
import { useLocation } from 'react-router-dom';

import { Modules } from '../../Interfaces/ICluster';

import './network.css';

const Visualizer = (props: Modules) => {
  const { state }: any = useLocation();
  return (
    <div className="kubeView">
      <iframe
        src={`${state[1]}`}
        height="800px"
        width="70%"
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default Visualizer;
