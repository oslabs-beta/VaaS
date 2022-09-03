import React, { useState, useEffect } from 'react';
import { Modules } from '../../Interfaces/ICluster';
import { Get } from '../../Services';
import './styles.css';

const OpenFaaS = (props: Modules) => {
  const [result, setResult] = useState({});

  useEffect(() => {
    const fetchFunctions = async () => {
      const funcs = await Get(
        `http://localhost:9000/api/faas?id=${props.id}&functionName=cows`, 
        { authorization: localStorage.getItem('token') }
      );
      setResult(funcs);
    };
    fetchFunctions();
  }, []);

  return (
    <div>
      {JSON.stringify(result)}
    </div>
  );
};

export default OpenFaaS;
