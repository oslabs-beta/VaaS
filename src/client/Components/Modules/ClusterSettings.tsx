import React, { useState } from 'react';
import './styles.css';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { Modules } from '../../Interfaces/ICluster';
import { Delete, Get, Put } from '../../Services';
import { setRender } from '../../Store/actions';
import { apiRoute } from '../../utils';
import { Container } from '@mui/system';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

const ClusterSettings = (props: Modules) => {
  const clusterReducer = useAppSelector(state => state.clusterReducer);
  const dispatch = useAppDispatch();
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
      setUpdateClusterError('Cluster successfully updated!');
      dispatch(setRender(!clusterReducer.render));
    } catch (err) {
      console.log('Update cluster error:', err);
    }
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleUpdateCluster();
  };

  return (
    <Container component={Card} sx={{
      color: "white",
      minHeight: '100%',
      minWidth: '100%',
      display: 'flex',
      textAlign: 'left',
      backgroundImage: "linear-gradient(#4f4a4b, #AFAFAF)"
    }} className="module-container">
      <div className='Module-top-row'>
        <div className='module-title noselect'>
          Cluster Settings
        </div>
        <Button 
          sx={{
            color: 'white',
            marginRight: '9px'
          }}
          variant="text"
          id="basic-button"
          className='full-screen-button'
          onClick={handleDeleteCluster}
        >
          Delete
        </Button>
        <Button 
          sx={{
            color: 'white'
          }}
          variant="text"
          id="basic-button"
          className='full-screen-button'
          onClick={handleUpdateCluster}
        >
          Update
        </Button>
      </div>
      <div id='module-content'>
        Cluster ID: {props.id}
        <span>{updateClusterError}</span>
        <p>{`Update cluster - URL: ${props.url} - K8 Port: ${props.k8_port} - FaaS Port: ${props.faas_port} - Cluster name: ${props.name} - Cluster Description: ${props.description}`}</p>
        <input onKeyDown={handleEnterKeyDown} className='update-cluster-input' id='update-cluster-url' type="text" placeholder='URL'/>
        <input onKeyDown={handleEnterKeyDown} className='update-cluster-input' id='update-cluster-k8' type="text" placeholder='K8 port'/>
        <input onKeyDown={handleEnterKeyDown} className='update-cluster-input' id='update-cluster-faas' type="text" placeholder='FaaS port'/>
        <input onKeyDown={handleEnterKeyDown} className='update-cluster-input' id='update-cluster-name' type="text" placeholder='Cluster name'/>
        <input onKeyDown={handleEnterKeyDown} className='update-cluster-input' id='update-cluster-description' type="text" placeholder='Cluster description'/>
      </div>
    </Container>
  );
};

export default ClusterSettings;
