import React, { useState, useEffect } from 'react';
import { clusterMetric } from '../../Queries/clusterPromQL';
import { ClusterTypes } from '../../Interfaces/ICluster';

import './styles.css';

const Cluster = (props: ClusterTypes) => {
  const [clusterName, setClusterName] = useState<string | undefined>('');
  const [description, setDescription] = useState<string | undefined>('');
  const [nodeName, setNodeName] = useState('');
  const [cpuUsage, setCpuUsage] = useState('');
  const [memoryUsage, setMemoryUsage] = useState('');
  const [totalDeployments, setTotalDeployments] = useState('');
  const [totalPods, setTotalPods] = useState('');

  useEffect(() => {
    //we will fetch data from Prometheus api? set the data here
    const fetchNodes = async () => {
      const nodes = await clusterMetric.allNodes(props._id, 'k8');
      setNodeName(nodes);
    };
    fetchNodes();
    setClusterName(props.name);
    setDescription(props.description);
    // const fetchCpuUsage = async () => {
      
    // }
    setCpuUsage('');
    //nodeMetric.cpuLoad
    setMemoryUsage('');
    //nodeMetric.memoryLoad
    setTotalDeployments('');
    setTotalPods('');
  }, []);

  return (
    <div id='cluster-card'>
      <p>{'Cluster name: ' + clusterName}</p>
      <p>{'Description: ' + description}</p>
      <p>{'Node: ' + nodeName}</p>
      <p>{'CPU usage: ' + cpuUsage}</p>
      <p>{'Memory usage: ' + memoryUsage}</p>
      <p>{'Total deployments: '  + totalDeployments}</p>
      <p>{'Total Pods: ' + totalPods}</p>
    </div>
  );
};

export default Cluster;
