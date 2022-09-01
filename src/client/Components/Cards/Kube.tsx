import React, { useState, useEffect } from 'react';
import { clusterMetric, nodeMetric } from '../../Queries';
import { ClusterTypes } from '../../Interfaces/ICluster';

import './styles.css';
import { Put } from '../../Services';
import { apiRoute } from '../../utils';
import Module from './Module';
import ClusterSettings from '../Modules/ClusterSettings';
import Container from '@mui/system/Container';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { setRender } from '../../Store/actions';

const Kube = (props: ClusterTypes) => {
  const [nodeName, setNodeName] = useState('');
  const [cpuUsage, setCpuUsage] = useState<number | undefined>(0);
  const [memoryUsage, setMemoryUsage] = useState('');
  const [totalDeployments, setTotalDeployments] = useState('');
  const [totalPods, setTotalPods] = useState('');
  const [module, setModule] = useState(true);
  const [settings, setSettings] = useState(false);
  const dispatch = useAppDispatch();
  const clusterReducer = useAppSelector(state => state.clusterReducer);

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
  }, []);

  const handleFavorite = async () => {
    try {
      const body = {
        clusterId: props._id,
        favorite: !props.favoriteStatus
      };
      await Put(apiRoute.getRoute('cluster'), body, { authorization: localStorage.getItem('token') });
      dispatch(setRender(!clusterReducer.render));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSettings = async () => {
    try {
      setModule(!module);
      setSettings(!settings);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container sx={{
      minWidth: '100%',
      justifyContent: 'left',
      display: 'flex',
      direction: 'column',
      textAlign: 'left',
      backgroundSize: 'contain',
      bgColor: '#3a4a5b',
    }} id="Kube">
      <div className='Kube-top-row'>
        <div className='cluster-title'>
          {props.favoriteStatus && <span className='set-favorite noselect' onClick={handleFavorite}>❤️</span>}
          {!props.favoriteStatus && <span className='set-favorite noselect' onClick={handleFavorite}>🤍</span>}
          <span className='set-favorite noselect'>&nbsp;</span>
          <b>{'' + props.name}:&nbsp;</b> 
            {'' + props.description}
        </div>
        <Button 
          sx={{
            color: "#3a4a5b",
          }}
          variant="text"
          id="basic-button"
          onClick={handleSettings}
        >
          {module && <SettingsIcon />}
          {settings && <AnalyticsIcon />}
        </Button>
      </div>
      <div id='overview'>
        <div className='ov-box'>
            <div className='ov-content'>
              <div className='noselect'>
                <h3>Summary</h3>
              </div>
              <div>{'Node: ' + nodeName}</div>
            </div>
        </div>
        <div className='ov-box'>
          <div className='ov-content'>
            <div className='noselect'>
              <h3>CPU Usage</h3>
            </div>
            <div>{'' + cpuUsage + '%'}</div>
          </div>
        </div>
        <div className='ov-box'>
          <div className='ov-content'>
            <div className='noselect'>
              <h3>Memory Usage</h3>
            </div>
            <div>{'' + memoryUsage}</div>
          </div>
        </div>
        <div className='ov-box'>
          <div className='ov-content'>
            <div className='noselect'>
              <h3>Deployments</h3>
            </div>
            <div>{'' + totalDeployments}</div>
          </div>
        </div>
        <div className='ov-box'>
          <div className='ov-content'>
            <div className='noselect'>
              <h3>Pods</h3>
            </div>
            <div>{'' + totalPods}</div>
          </div>
        </div>
        <div className='ov-box'></div>
      </div>
      <div id='module'>
        {module && <Module id={props._id} nested={true} />}
        {settings && <ClusterSettings url={props.url} k8_port={props.k8_port} faas_port={props.faas_port} name={props.name} description={props.description} id={props._id} />}
      </div>
    </Container>
  );
};

export default Kube;
