import React, { useEffect } from 'react';
import CustomQuery from '../Modules/CustomQuery';
import { Visualizer } from '../../Interfaces/IVisualizer';

const Visualizer = (props: Visualizer) => {
  return (
    <div>
      <CustomQuery id= {props.id} />
    </div>
  );
};

export default Visualizer;