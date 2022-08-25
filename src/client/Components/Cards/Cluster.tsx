import React, { useState, useEffect } from 'react';
import { clusterMetric, nodeMetric } from '../../Queries';
import { ClusterTypes } from '../../Interfaces/ICluster';

import './styles.css';

const Cluster = (props: ClusterTypes) => {
  const [clusterName, setClusterName] = useState<string | undefined>('');
  const [description, setDescription] = useState<string | undefined>('');
  const [favoriteStatus, setFavoriteStatus] = useState<boolean | undefined>(false);
  const [nodeName, setNodeName] = useState('');
  const [cpuUsage, setCpuUsage] = useState<number | undefined>(0);
  const [memoryUsage, setMemoryUsage] = useState('');
  const [totalDeployments, setTotalDeployments] = useState('');
  const [totalPods, setTotalPods] = useState('');

  useEffect(() => {
    const fetchNodes = async () => {
      const nodes = await clusterMetric.allNodes(props._id, 'k8');
      setNodeName(nodes);
    };
    fetchNodes();
    const fetchCpuUsage = async () => {
      const cpuUsage = await nodeMetric.cpuLoad(props._id, 'k8');
      setCpuUsage(cpuUsage);
    };
    fetchCpuUsage();
    const fetchMemoryUsage = async () => {
      const memoryUsage = await nodeMetric.memoryLoad(props._id, 'k8', nodeName);
      setMemoryUsage(memoryUsage);
    };
    fetchMemoryUsage();
    const fetchTotalDeployments = async () => {
      const totalDeployments = await clusterMetric.totalDeployments(props._id, 'k8');
      setTotalDeployments(totalDeployments.length);
    };
    fetchTotalDeployments();
    setTotalDeployments('');
    const fetchTotalPod = async () => {
      const totalPods = await clusterMetric.totalPods(props._id, 'k8');
      setTotalPods(totalPods);
    };
    fetchTotalPod();
    setClusterName(props.name);
    setDescription(props.description);
  }, []);

  const handleFavorite = async () => {
    try {
      if(props.favorite) {
        for (const element of props.favorite) {
          if(element === localStorage.getItem('userId')) {
            setFavoriteStatus(!favoriteStatus);
            break;
          }
        }
      }
      const body = {
        clusterId: props._id,
        favorite: favoriteStatus
      };

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id='cluster-card'>
      <span>{'Cluster name: ' + clusterName}<button id="favorite-btn" onClick={handleFavorite}>Favorite</button></span>
      <p>{'Description: ' + description}</p>
      <p>{'Node: ' + nodeName}</p>
      <p>{'CPU usage: ' + cpuUsage + '%'}</p>
      <p>{'Memory usage: ' + memoryUsage}</p>
      <p>{'Total deployments: '  + totalDeployments}</p>
      <p>{'Total Pods: ' + totalPods}</p>
    </div>
  );
};

export default Cluster;
