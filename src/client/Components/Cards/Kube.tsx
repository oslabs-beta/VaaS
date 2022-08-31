import React, { useState, useEffect } from 'react';
import { clusterMetric, nodeMetric } from '../../Queries';
import { ClusterTypes } from '../../Interfaces/ICluster';

import './styles.css';
import { Put } from '../../Services';
import { apiRoute } from '../../utils';
import Module from './Module';
import { Container } from '@mui/system';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch } from 'react-redux';
import { IReducers } from '../../Interfaces/IReducers';
import { useSelector } from 'react-redux';
import { setRender } from '../../Store/actions';


const Kube = (props: ClusterTypes) => {
  const [clusterName, setClusterName] = useState<string | undefined>('');
  const [description, setDescription] = useState<string | undefined>('');
  const [nodeName, setNodeName] = useState('');
  const [cpuUsage, setCpuUsage] = useState<number | undefined>(0);
  const [memoryUsage, setMemoryUsage] = useState('');
  const [totalDeployments, setTotalDeployments] = useState('');
  const [totalPods, setTotalPods] = useState('');
  const [module, setModule] = useState(false);
  const dispatch = useDispatch();
  const clusterReducer = useSelector((state: IReducers) => state.clusterReducer);

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
      dispatch(setRender(!clusterReducer.render));
    } catch (err) {
      console.log(err);
    }
  };

  const handleModule = async () => {
    try {
      setModule(!module);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container sx={{
      minWidth: '100%',
      justifyContent: 'center',
      display: 'flex',
      direction: 'column',
      textAlign: 'left',
      backgroundSize: 'contain',
      bgcolor: '#3a4a5b'
    }} id="Kube">
      <div>
        <div className='cluster-title'>
          {props.favoriteStatus && <span className='set-favorite' onClick={handleFavorite}>❤️</span>}
          {!props.favoriteStatus && <span className='set-favorite' onClick={handleFavorite}>🤍</span>}&nbsp;<b>{'' + clusterName}:&nbsp;</b> 
            {'' + description}
        </div>
        <div className='card-controls'>
          <p><div id="card-control" onClick={handleModule}>Modules</div></p>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="spanning table" sx={{
          'overflow-y': 'visible'
        }}>
          <TableHead>
            <TableCell align="center">Node</TableCell>
            <TableCell align="center">CPU Usage</TableCell>
            <TableCell align="center">Memory Usage</TableCell>
            <TableCell align="center">Total Deployments</TableCell>
            <TableCell align="center">Total Pods</TableCell>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">{'' + nodeName}</TableCell>
              <TableCell align="center">{'' + cpuUsage + '%'}</TableCell>
              <TableCell align="center">{'' + memoryUsage}</TableCell>
              <TableCell align="center">{'' + totalDeployments}</TableCell>
              <TableCell align="center">{'' + totalPods}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {module && <Module id={props._id} />}
    </Container>
  );
};

export default Kube;
