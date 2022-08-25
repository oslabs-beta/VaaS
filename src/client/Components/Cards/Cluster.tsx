import React, { useState, useEffect } from 'react';
import { clusterMetric } from '../../Queries/clusterPromQL';

import './styles.css';

const Cluster = () => {
  const [nodeName, setNodeName] = useState('');
  const [cpuUsage, setCpuUsage] = useState('');
  const [memoryUsage, setMemoryUsage] = useState('');
  const [totalDeployments, setTotalDeployments] = useState('');
  const [totalPods, setTotalPods] = useState('');

  useEffect(() => {
    //we will fetch data from Prometheus api? set the data here
    const fetchNodes = async () => {
      const nodes = await clusterMetric.allNodes('63055ac68682abcebadaf605', 'k8');
      setNodeName(nodes);
    };
    
    fetchNodes();

    setCpuUsage('');
    setMemoryUsage('');
    setTotalDeployments('');
    setTotalPods('');
  }, []);

  return (
    <div id='cluster-card'>
      <p>Cluster Overview</p>
      <p>{'Node: ' + nodeName}</p>
      <p>{'CPU usage: ' + cpuUsage}</p>
      <p>{'Memory usage: ' + memoryUsage}</p>
      <p>{'Total deployments: '  + totalDeployments}</p>
      <p>{'Total Pods: ' + totalPods}</p>
    </div>
  );
};

export default Cluster;
