import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modules } from '../../Interfaces/ICluster';
import { Get, Post } from '../../Services';
import { FunctionTypes } from '../../Interfaces/IFunction';
import './styles.css';
import { apiRoute } from '../../utils';

const OpenFaaS = (props: Modules) => {
  const [result, setResult] = useState<FunctionTypes[]>([]);
  const [openFaasFunctions, setOpenFaasFunctions] = useState<FunctionTypes[]>([]);
  const [selectedOpenFaasFunction, setSelectedOpenFaasFunction] = useState('');
  const [selectedDeployedFunction, setSelectedDeployedFunction] = useState('');
  const [invokedOutput, setInvokedOutput] = useState('');
  const [renderFunctions, setRenderFunctions] = useState(false);

  useEffect(() => {
    const openFaasFunctions = async () => {
      try {
        const funcs = await fetch('https://raw.githubusercontent.com/openfaas/store/master/functions.json').then(res => res.json());
        setOpenFaasFunctions(funcs.functions);
      } catch (error) {
        console.log('Error in fetching OpenFaaS Functions', error);
      }
    };
    const fetchFunctions = async () => {
      const funcs = await Get(
        `http://localhost:9000/api/faas?id=${props.id}`,
        {
          // clusterId: props.id,
          authorization: localStorage.getItem('token')
        }
      );
      setResult(funcs);
    };
    openFaasFunctions();
    fetchFunctions();
  }, [renderFunctions]);

  const handleDeployOpenFaas = async () => {
    try {
      const getFunc = openFaasFunctions.find(element => element.name === selectedOpenFaasFunction);
      const body = {
        clusterId: props.id,
        service: selectedOpenFaasFunction,
        image: getFunc?.images.x86_64
      };
      await Post(apiRoute.getRoute('faas'), body, { authorization: localStorage.getItem('token') });
      setRenderFunctions(!renderFunctions);
    } catch (error) {
      console.log('Error in handleDeployOpenFaas', error);
    }
  };

  const handleOpenFaasFunctionsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOpenFaasFunction(e.target.value);
  };

  const handleInvoke = async () => {
    try {
      const body = {
        clusterId: props.id,
        functionName: selectedDeployedFunction
      };
      const res = await Post(apiRoute.getRoute('faas/invoke'), body, { authorization: localStorage.getItem('token') });
      setInvokedOutput(res);
    } catch (error) {
      console.log('Error in handleInvoke', error);
    }
  };

  const handleDeployedFunctionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeployedFunction(e.target.value);
  };
  return (
    <div>
      <select onChange={handleOpenFaasFunctionsChange} defaultValue="default">
        <option value="default">OpenFaaS Functions Store</option>
        {openFaasFunctions.map((element, idx) => {
          return <option key={idx} value={element.name}>{element.name}</option>;
        })}
      </select>
      <button onClick={handleDeployOpenFaas}>Deploy selected function from OpenFaaS function store</button>
      <div>
        <select onChange={handleDeployedFunctionChange} defaultValue="default">
          <option value="default">Deployed Functions</option>
          {result.map((element, idx) => {
            return <option key={idx} value={element.name}>{element.name}</option>;
          })}
        </select>
        <button onClick={handleInvoke}>Invoke selected function</button>
      </div>
      <div>
        {invokedOutput}
      </div>
    </div>
  );
};

export default OpenFaaS;
