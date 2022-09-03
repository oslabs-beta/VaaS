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
import TextField from '@mui/material/TextField';

const ClusterSettings = (props: Modules) => {
  const clusterReducer = useAppSelector(state => state.clusterReducer);
  const dispatch = useAppDispatch();
  const [updateClusterError, setUpdateClusterError] = useState('');
  const [settingsField] = useState({
    background: 'white',
    borderRadius: '5px',
    marginRight: '3px',
    width: '28%',
    fontSize: '10px',
    border: '1px red border'
  });
  const [buttonColor] = useState({
    color: "white"
  });

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
        faas_username: (document.getElementById('update-cluster-faas-username') as HTMLInputElement).value,
        faas_password: (document.getElementById('update-cluster-faas-password') as HTMLInputElement).value,
        name: (document.getElementById('update-cluster-name') as HTMLInputElement).value || props.name,
        description: (document.getElementById('update-cluster-description') as HTMLInputElement).value || props.description,
      };
      if (
        body.url === props.url &&
        body.k8_port === props.k8_port &&
        body.faas_port === props.faas_port &&
        !body.faas_username &&
        !body.faas_password &&
        body.name === props.name &&
        body.description === props.description
      ) {
        setUpdateClusterError('Nothing to update!');
        return;
      }
      if (
        (body.faas_username && !body.faas_password) ||
        (body.faas_password && !body.faas_username)
      ) {
        setUpdateClusterError('Both OpenFaaS credentials required');
        return;
      }
      if (!body.k8_port?.toString().match(/[0-9]/g) || !body.faas_port?.toString().match(/[0-9]/g)) {
        setUpdateClusterError('Port(s) must be numbers');
        return;
      }
      if (body.name !== props.name) {
        const cluster = await Get(apiRoute.getRoute(`cluster:${body.name}`), { authorization: localStorage.getItem('token') });
        if (!cluster.message) {
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
            ...buttonColor,
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
          sx={buttonColor}
          variant="text"
          id="basic-button"
          className='full-screen-button'
          onClick={handleUpdateCluster}
        >
          Update
        </Button>
      </div>
      <div id='module-content'>
        <div className='cluster-id'>Cluster ID: {props.id}</div>
        <div className='setting-fields'>
          <TextField
            onKeyDown={handleEnterKeyDown}
            className='update-cluster-input'
            id='update-cluster-url'
            type="text"
            placeholder={props.url}
            label="Cluster URL"
            variant="filled"
            size='small'
            margin="dense"
            sx={settingsField}
          />
          <TextField
            onKeyDown={handleEnterKeyDown}
            className='update-cluster-input'
            id='update-cluster-k8'
            type="text"
            placeholder={String(props.k8_port)}
            label="Kubernetes Port"
            variant="filled"
            size='small'
            margin="dense"
            sx={settingsField}
          />
          <TextField
            onKeyDown={handleEnterKeyDown}
            className='update-cluster-input'
            id='update-cluster-faas'
            type="text"
            placeholder={String(props.faas_port)}
            label="FaaS Port"
            variant="filled"
            size='small'
            margin="dense"
            sx={settingsField}
          />
          <TextField
            onKeyDown={handleEnterKeyDown}
            className='update-cluster-input'
            id='update-cluster-faas-username'
            type="text"
            label="FaaS Username"
            variant="filled"
            size='small'
            margin="dense"
            sx={settingsField}
          />
          <TextField
            onKeyDown={handleEnterKeyDown}
            className='update-cluster-input'
            id='update-cluster-faas-password'
            type="text"
            label="FaaS Password"
            variant="filled"
            size='small'
            margin="dense"
            sx={settingsField}
          />
          <TextField
            onKeyDown={handleEnterKeyDown}
            className='update-cluster-input'
            id='update-cluster-name'
            type="text"
            placeholder={props.name}
            label="Cluster Name"
            variant="filled"
            size='small'
            margin="dense"
            sx={settingsField}
          />
          <TextField
            onKeyDown={handleEnterKeyDown}
            className='update-cluster-input'
            id='update-cluster-description'
            type="text"
            placeholder={props.description}
            label="Cluster Description"
            variant="filled"
            size='small'
            margin="dense"
            sx={settingsField}
          />
          <span>{updateClusterError}</span>
        </div>
      </div>
    </Container>
  );
};

export default ClusterSettings;
