import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { Modules } from '../../Interfaces/ICluster';
import { Get, Put, Delete } from '../../Services';
import { setRender } from '../../Store/actions';
import { apiRoute } from '../../utils';
import { IReducers } from '../../Interfaces/IReducers';
import { Container } from '@mui/system';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './styles.css';

const ClusterSettings = (props: Modules) => {
  const clusterReducer = useAppSelector((state: IReducers) => state.clusterReducer);
  const dispatch = useAppDispatch();
  const [updateClusterError, setUpdateClusterError] = useState('');
  const [settingsField] = useState({
    background: 'white',
    borderRadius: '5px',
    marginRight: '3px',
    marginBottom: '0px',
    width: '350px',
    fontSize: '10px'
  });
  const [buttonColor] = useState({
    color: "white"
  });

  const handleDeleteCluster = async () => {
    try {
      const body = {
        clusterId: props.id
      };
      await Delete(
        apiRoute.getRoute('cluster'), 
        body, 
        { 
          authorization: localStorage.getItem('token') 
        }
      );
      dispatch(
        setRender(!clusterReducer.render)
      );
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
      await Put(
        apiRoute.getRoute('cluster'), 
        body, 
        { 
          authorization: localStorage.getItem('token') 
        }
      );
      setUpdateClusterError('Cluster successfully updated!');
      dispatch(
        setRender(!clusterReducer.render)
      );
    } catch (err) {
      console.log('Update cluster error:', err);
    }
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleUpdateCluster();
  };

  return (
    <div>
      <Container 
        className="module-container"
        component={Card} 
        sx={{
          color: "white",
          minHeight: '100%',
          minWidth: '100%',
          display: 'flex',
          justifyContent: 'left',
          alignContent: 'center',
          backgroundImage: "linear-gradient(#4f4a4b, #AFAFAF)"
        }} 
      >
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
            className='full-screen-button'
            variant="text"
            id="basic-button"
            onClick={handleUpdateCluster}
            sx={buttonColor}
          >
            Update
          </Button>
        </div>
        <div id='module-content'>
          <div className='setting-fields'>
            <div>
              <TextField
                onKeyDown={handleEnterKeyDown}
                id='update-cluster-url'
                type="text"
                placeholder={props.url}
                label="Cluster URL"
                variant="filled"
                size='small'
                margin="dense"
                sx={settingsField}
              />
            </div>
            <div>
              <TextField
                onKeyDown={handleEnterKeyDown}
                id='update-cluster-k8'
                type="text"
                placeholder={String(props.k8_port)}
                label="Kubernetes Port"
                variant="filled"
                size='small'
                margin="dense"
                sx={settingsField}
              />
            </div>
            <div>
              <TextField
                onKeyDown={handleEnterKeyDown}
                id='update-cluster-faas'
                type="text"
                placeholder={String(props.faas_port)}
                label="FaaS Port"
                variant="filled"
                size='small'
                margin="dense"
                sx={settingsField}
              />
            </div>
            <div>
              <TextField
                onKeyDown={handleEnterKeyDown}
                id='update-cluster-faas-username'
                type="text"
                label="FaaS Username"
                variant="filled"
                size='small'
                margin="dense"
                sx={settingsField}
              />
            </div>
            <div>
              <TextField
                onKeyDown={handleEnterKeyDown}
                id='update-cluster-faas-password'
                type="text"
                label="FaaS Password"
                variant="filled"
                size='small'
                margin="dense"
                sx={settingsField}
              />
            </div>
            <div>
              <TextField
                onKeyDown={handleEnterKeyDown}
                id='update-cluster-name'
                type="text"
                placeholder={props.name}
                label="Cluster Name"
                variant="filled"
                size='small'
                margin="dense"
                sx={settingsField}
              />
            </div>
            <div>
              <TextField
                onKeyDown={handleEnterKeyDown}
                id='update-cluster-description'
                type="text"
                placeholder={props.description}
                label="Cluster Description"
                variant="filled"
                size='small'
                margin="dense"
                sx={settingsField}
              />
            </div>
            <div>
              {updateClusterError}
            </div>
          </div>
        </div>
      </Container>
      <Container className='cluster-id'>
        {props.id}
      </Container>
    </div>
  );
};

export default ClusterSettings;
