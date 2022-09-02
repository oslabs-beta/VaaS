import React, { useState, useEffect } from 'react';
import { Modules } from '../../Interfaces/ICluster';
import './styles.css';

const OpenFaaS = (props: Modules) => {
  const [functions, setFunctions] = useState<any[]>([]);
  const [deployedFunctions, setDeployedFunctions] = useState<any[]>([]);

  useEffect(() => {
    const test = async () => {
      try {
        const res = await fetch('https://raw.githubusercontent.com/openfaas/store/master/functions.json').then(res => res.json());
        console.log(res.functions);
        setFunctions(res.functions);
      } catch (error) {
        console.log('Error in test', error);
      }
    };
    test();

    const test2 = async () => {
      try {
        const headers = {
          "Access-Control-Allow-Origin": "*"
        };
        const res = await fetch(`http://localhost:30003/system/functions`, {
          headers
        }).then(res => res.json());
        console.log(res);
        setDeployedFunctions(res);
      } catch (error) {
        console.log('Error in test', error);
      }
    };
    test2();
  }, []);

  return (
    <div>
      <p>OpenFaaS functions</p>
      <select name="selectList" id="selectList" defaultValue={'default'}>
        <option hidden value="default" disabled>OpenFaaS functions store</option>
        {functions.map((element, idx) => {
          return <option key={idx} value="">{element.title}</option>;
        })}
      </select>
      <select name="selectList" id="selectList" defaultValue={'default'}>
        <option hidden value="default" disabled>Deployed functions</option>
        {deployedFunctions.map((element, idx) => {
          return <option key={idx} value="">{element.name}</option>;
        })}
      </select>
    </div>
  );
};

export default OpenFaaS;
