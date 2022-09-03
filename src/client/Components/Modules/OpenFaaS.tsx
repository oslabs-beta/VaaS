import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modules } from '../../Interfaces/ICluster';
import { Delete, Get, Post } from '../../Services';
import { DeployedFunctionTypes, FunctionTypes } from '../../Interfaces/IFunction';
import './styles.css';
import { apiRoute } from '../../utils';
import { useLocation } from 'react-router-dom';

const OpenFaaS = (props: Modules) => {
  const { state }: any = useLocation();
  const [id] = useState(props.id || state[0]);
  const [deployedFunctions, setDeployedFunctions] = useState<DeployedFunctionTypes[]>([]);
  const [openFaaSFunctions, setOpenFaaSFunctions] = useState<FunctionTypes[]>([]);
  const [selectedOpenFaaSFunction, setSelectedOpenFaaSFunction] = useState('');
  const [selectedDeployedFunction, setSelectedDeployedFunction] = useState('');
  const [invokedOutput, setInvokedOutput] = useState('');
  const [renderFunctions, setRenderFunctions] = useState(false);
  console.log(deployedFunctions);
  useEffect(() => {
    const openFaaSFunctions = async () => {
      try {
        const funcs = await Get(apiRoute.getRoute('faas?OpenFaaSStore=true'), { authorization: localStorage.getItem('token') });
        setOpenFaaSFunctions(funcs.functions);
      } catch (error) {
        console.log('Error in fetching OpenFaaS Functions', error);
      }
    };
    const fetchFunctions = async () => {
      try {
        const funcs = await Get(
          apiRoute.getRoute(`faas`),
          {
            authorization: localStorage.getItem('token'),
            id: id
          }
        );
        if (funcs.message) {
          setDeployedFunctions([]);
        } else {
          setDeployedFunctions(funcs);
        }
      } catch (error) {
        console.log('Error in fetching deployed OpenFaaS Functions', error);
      }
    };
    openFaaSFunctions();
    fetchFunctions();
  }, [renderFunctions]);

  const handleDeployOpenFaaS = async () => {
    try {
      const getFunc = openFaaSFunctions.find(element => element.name === selectedOpenFaaSFunction);
      const body = {
        clusterId: id,
        service: selectedOpenFaaSFunction,
        image: getFunc?.images.x86_64
      };
      const response = await Post(apiRoute.getRoute('faas'), body, { authorization: localStorage.getItem('token') });
      if (response.success) {
        setRenderFunctions(!renderFunctions);
      }
    } catch (error) {
      console.log('Error in handleDeployOpenFaaS', error);
    }
  };

  const handleOpenFaaSFunctionsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOpenFaaSFunction(e.target.value);
  };

  const handleInvoke = async () => {
    try {
      const body = {
        clusterId: id,
        functionName: selectedDeployedFunction
      };
      const res = await Post(apiRoute.getRoute('faas/invoke'), body, { authorization: localStorage.getItem('token') });
      setInvokedOutput(res);
    } catch (error) {
      console.log('Error in handleInvoke', error);
    }
  };

  const handleDelete = async () => {
    try {
      const body = {
        clusterId: id,
        functionName: selectedDeployedFunction
      };
      const response = await Delete(apiRoute.getRoute('faas'), body, { authorization: localStorage.getItem('token') });
      if (response.success) {
        setDeployedFunctions(deployedFunctions.filter(element => element.name !== body.functionName));
        setInvokedOutput('Deployed function deleted');
      }
    } catch (error) {
      console.log('Error in handleInvoke', error);
    }
  };

  const handleDeployedFunctionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeployedFunction(e.target.value);
  };

  const displayFunctionData = (name: string) => {
    return deployedFunctions.find(element => element.name === name);
  };

  return (
    <div>
      <select onChange={handleOpenFaaSFunctionsChange} defaultValue="default">
        <option value="default" hidden>OpenFaaS Functions Store</option>
        {openFaaSFunctions.map((element, idx) => {
          return <option key={idx} value={element.name}>{element.name}</option>;
        })}
      </select>
      <button onClick={handleDeployOpenFaaS}>Deploy selected function from OpenFaaS function store</button>
      <div>
        <select onChange={handleDeployedFunctionChange} defaultValue="default">
          <option value="default" hidden>Deployed Functions</option>
          {deployedFunctions.map((element, idx) => {
            return <option key={idx} value={element.name}>{element.name}</option>;
          })}
        </select>
        <button onClick={handleInvoke}>Invoke selected function</button>
        <button onClick={handleDelete}>Delete selected function</button>
      </div>
      <div>
        {
          selectedDeployedFunction &&
          <span>
            {`
            Replicas: ${displayFunctionData(selectedDeployedFunction)?.replicas} 
            Invocation count: ${displayFunctionData(selectedDeployedFunction)?.invocation}
            Image: ${displayFunctionData(selectedDeployedFunction)?.image}
            URL: ${props.url}:${props.faas_port}/function/${selectedDeployedFunction}
            `}
          </span>
        }
      </div>
      <div>
        {invokedOutput}
      </div>
    </div>
  );
};

export default OpenFaaS;
