import React, { useState, useEffect } from 'react';
import { Modules } from '../../Interfaces/ICluster';
import './styles.css';

const CustomQuery = (props: Modules) => {
  return (
    <div>
      <div className='module-title'>
        Run Custom Query
      </div>
      <div>
        will render here
      </div>
    </div>
  );
};

export default CustomQuery;
