import React, { useState, useEffect } from 'react';
import { clusterMetric, nodeMetric } from '../../Queries';
import { ClusterTypes } from '../../Interfaces/ICluster';

import './styles.css';
import { Put } from '../../Services';
import { apiRoute } from '../../utils';
import Visualizer from '../Visualizer/Visualizer';
import ClusterSettings from '../ClusterSettings/ClusterSettings';


const Cluster = (props: ClusterTypes) => {
  const [clusterName, setClusterName] = useState<string | undefined>('');
  const [description, setDescription] = useState<string | undefined>('');
  const [favoriteStatus, setFavoriteStatus] = useState<boolean | undefined>(props.favoriteStatus);
  const [nodeName, setNodeName] = useState('');
  const [cpuUsage, setCpuUsage] = useState<number | undefined>(0);
  const [memoryUsage, setMemoryUsage] = useState('');
  const [totalDeployments, setTotalDeployments] = useState('');
  const [totalPods, setTotalPods] = useState('');
  const [visualizer, setVisualizer] = useState(false);
  const [settings, setSettings] = useState(false);

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
      const memoryUsage = await clusterMetric.memoryLoad(props._id, 'k8');
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
      const body = {
        clusterId: props._id,
        favorite: !props.favoriteStatus
      };
      await Put(apiRoute.getRoute('cluster'), body, { authorization: localStorage.getItem('token') });
      setFavoriteStatus(!props.favoriteStatus);
      // props.favoriteStatus = !props.favoriteStatus;
      props.setHomeRender(!props.homeRender);
      
    } catch (err) {
      console.log(err);
    }
  };

  const handleVisualizer = async () => {
    try {
      setVisualizer(!visualizer);
      setSettings(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSettings = async () => {
    try {
      setSettings(!settings);
      setVisualizer(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id='cluster-card'>
      <div>
        <button id="favorite-btn" onClick={handleFavorite}>Favorite</button>
        <button id="favorite-btn" onClick={handleVisualizer}>Visualizer</button>
        <button id="favorite-btn" onClick={handleSettings}>Settings</button>
      </div>
      <div>
        <h2>{'' + clusterName}</h2>
        <p>{'' + description}</p>
        <p>{'Favorite Status:' + props.favoriteStatus}</p>
      </div>
      <table>
        <tr>
          <td>Node</td>
          <td>CPU Usage</td>
          <td>Memory Usage</td>
          <td>Total Deployments</td>
          <td>Total Pods</td>
        </tr>
        <tr>
          <td>{'' + nodeName}</td>
          <td>{'' + cpuUsage + '%'}</td>
          <td>{'' + memoryUsage}</td>
          <td>{'' + totalDeployments}</td>
          <td>{'' + totalPods}</td>
        </tr>
      </table>
      {visualizer && <Visualizer />}
      {settings && <ClusterSettings id={props._id}/>}
    </div>
  );
};

export default Cluster;
