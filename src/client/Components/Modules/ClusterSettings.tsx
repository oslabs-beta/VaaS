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

const ClusterSettings = (props: Modules) => {
  const clusterReducer = useAppSelector((state: IReducers) => state.clusterReducer);
  const apiReducer = useAppSelector((state: IReducers) => state.apiReducer);
  const dispatch = useAppDispatch();

  const [dbData] = useState(apiReducer.clusterDbData.find(element => element._id === props.id));

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
        url: (document.getElementById('update-cluster-url') as HTMLInputElement).value || dbData?.url,
        k8_port: (document.getElementById('update-cluster-k8') as HTMLInputElement).value || dbData?.k8_port,
        faas_port: (document.getElementById('update-cluster-faas') as HTMLInputElement).value || dbData?.faas_port,
        faas_username: (document.getElementById('update-cluster-faas-username') as HTMLInputElement).value,
        faas_password: (document.getElementById('update-cluster-faas-password') as HTMLInputElement).value,
        name: (document.getElementById('update-cluster-name') as HTMLInputElement).value || dbData?.name,
        description: (document.getElementById('update-cluster-description') as HTMLInputElement).value || dbData?.description,
      };
      if (
        body.url === dbData?.url &&
        body.k8_port === dbData?.k8_port &&
        body.faas_port === dbData?.faas_port &&
        !body.faas_username &&
        !body.faas_password &&
        body.name === dbData?.name &&
        body.description === dbData?.description
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
      if (body.name !== dbData?.name) {
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
          <Container 
            sx={{
              width: '100%',
              textAlign: 'center'
            }}
          >
            <div>
              <TextField
                onKeyDown={handleEnterKeyDown}
                id='update-cluster-url'
                type="text"
                placeholder={dbData?.url}
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
                placeholder={String(dbData?.k8_port)}
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
                placeholder={String(dbData?.faas_port)}
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
                placeholder={dbData?.name}
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
                placeholder={dbData?.description}
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
          </Container>
        </div>
      </Container>
      <Container className='cluster-id'>
        {props.id}
      </Container>
    </div>
  );
};

export default ClusterSettings;
