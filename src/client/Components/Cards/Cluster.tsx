import React, { useState, useEffect } from 'react';

import './styles.css'

const Cluster = () => {
  const [nodeName, setNodeName] = useState('');
  const [cpuUsage, setCpuUsage] = useState('');
  const [memoryUsage, setMemoryUsage] = useState('');
  const [totalDeployments, setTotalDeployments] = useState('');
  const [totalPods, setTotalPods] = useState('');

  const fetchClusterNodes = async () => {
    const data = await fetch('http://localhost:30000/api/v1/query?query=kube_node_info', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json());
    const nodes = data.data.result.map((result: any) => {
      return result.metric.node;
    });
    return nodes;
  }

  useEffect(() => {
    //we will fetch data from Prometheus api? set the data here
    fetchClusterNodes().then(res => {
      console.log(res);
      setNodeName(res[0]);
    });

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
  )
}

export default Cluster;
