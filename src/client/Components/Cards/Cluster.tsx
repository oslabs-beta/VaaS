import React, { useState, useEffect } from 'react';

import './styles.css'

const Cluster = () => {
  const [cpuUsage, setCpuUsage] = useState('');
  const [memoryUsage, setMemoryUsage] = useState('');
  const [totalDeployments, setTotalDeployments] = useState('');
  const [totalPods, setTotalPods] = useState('');

  useEffect(() => {
    //we will fetch data from Prometheus api? set the data here
    setCpuUsage('');
    setMemoryUsage('');
    setTotalDeployments('');
    setTotalPods('');
  }, [])
  return (
    <div id='cluster-card'>
      <p>Cluster</p>
      <p>{'CPU usage: ' + cpuUsage}</p>
      <p>{'Memory usage: ' + memoryUsage}</p>
      <p>{'Total deployments: '  + totalDeployments}</p>
      <p>{'Total Pods: ' + totalPods}</p>
    </div>
  )
}

export default Cluster;