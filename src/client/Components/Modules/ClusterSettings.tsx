import React, { useEffect, useState } from 'react';
import './styles.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Modules } from '../../Interfaces/ICluster';
import { IReducers } from '../../Interfaces/IReducers';
import { Delete, Get, Put } from '../../Services';
import { setRender } from '../../Store/actions';
import { apiRoute } from '../../utils';
import { Container } from '@mui/system';
import Card from '@mui/material/Card';

const ClusterSettings = (props: Modules) => {
  const clusterReducer = useSelector((state: IReducers) => state.clusterReducer);
  const dispatch = useDispatch();
  const [updateClusterError, setUpdateClusterError] = useState('');

  const handleDeleteCluster = async () => {
    console.log(props.id);
    try {
      const body = {
        clusterId: props.id
      };
      await Delete(apiRoute.getRoute('cluster'), body, { authorization: localStorage.getItem('token') });
      dispatch(setRender(!clusterReducer.render));
    } catch (err) {
      console.log('Delete cluster error:', err);
    }
  };
  
  const handleUpdateCluster = async () => {
    try {
      const body = {
        clusterId: props.id,
        url: (document.getElementById('update-cluster-url') as HTMLInputElement).value || props.url,
        k8_port: (document.getElementById('update-cluster-k8') as HTMLInputElement).value || props.k8_port,
        faas_port: (document.getElementById('update-cluster-faas') as HTMLInputElement).value || props.faas_port,
        name: (document.getElementById('update-cluster-name') as HTMLInputElement).value || props.name,
        description: (document.getElementById('update-cluster-description') as HTMLInputElement).value || props.description,
      };
      if(body.url === props.url && body.k8_port === props.k8_port && body.faas_port === props.faas_port && body.name === props.name && body.description === props.description) {
        setUpdateClusterError('Nothing to update!');
        return;
      }
      if(!body.k8_port?.toString().match(/[0-9]/g) || !body.faas_port?.toString().match(/[0-9]/g)) {
        setUpdateClusterError('Port(s) must be numbers');
        return;
      }
      if(body.name !== props.name) {
        const cluster = await Get(apiRoute.getRoute(`cluster:${body.name}`), { authorization: localStorage.getItem('token') });
        if(!cluster.message) {
          setUpdateClusterError('Cluster name already exists. Try another name.');
          return;
        }
      }
      await Put(apiRoute.getRoute('cluster'), body, { authorization: localStorage.getItem('token') });
      setUpdateClusterError('Cluster successfully updated');
      dispatch(setRender(!clusterReducer.render));
    } catch (err) {
      console.log('Update cluster error:', err);
    }
  };

  return (
    <Container component={Card} sx={{
      color: "white",
      minHeight: '143px',
      minWidth: '100%',
      display: 'flex',
      textAlign: 'left',
      marginBottom: '0.5rem',
      backgroundImage: "linear-gradient(#4f4a4b, #AFAFAF)"
    }} className="module-container">
      <div className='Module-top-row'>
        <div className='settings-title noselect'>
          Cluster Settings
        </div>
      </div>
      <div id='module-content'>
        Cluster ID: {props.id}
        <button onClick={handleDeleteCluster} id='delete-cluster-btn' type='button'>Delete Cluster</button>
        <span>{updateClusterError}</span>
      </div>
      <div>
        <p>{`Update cluster - URL: ${props.url} - K8 Port: ${props.k8_port} - FaaS Port: ${props.faas_port} - Cluster name: ${props.name} - Cluster Description: ${props.description}`}</p>
        <input className='update-cluster-input' id='update-cluster-url' type="text" placeholder='URL'/>
        <input className='update-cluster-input' id='update-cluster-k8' type="text" placeholder='K8 port'/>
        <input className='update-cluster-input' id='update-cluster-faas' type="text" placeholder='FaaS port'/>
        <input className='update-cluster-input' id='update-cluster-name' type="text" placeholder='Cluster name'/>
        <input className='update-cluster-input' id='update-cluster-description' type="text" placeholder='Cluster description'/>
        <button onClick={handleUpdateCluster}>Update cluster</button>
      </div>
    </Container>
  );
};

export default ClusterSettings;
