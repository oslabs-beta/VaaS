import React, { useState, useEffect } from 'react';
import { Modules } from '../../Interfaces/ICluster';
import './styles.css';

const OpenFaaS = (props: Modules) => {
  return (
    <div>
      <div className='module-title'>
        OpenFaaS
      </div>
      <div>
        will render here
      </div>
    </div>
  );
};

export default OpenFaaS;
