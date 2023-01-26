import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { setRender } from '../../Store/actions';
import { Modules } from '../../Interfaces/ICluster';
import { IReducers } from '../../Interfaces/IReducers';
import { deleteCluster, editCluster } from '../../Queries';
import Container from '@mui/system/Container';
// import { Box, TextField, Card, Button } from '@mui/material';
import { Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

const ClusterSettings = (props: Modules) => {
  // Use reducers to pull in things from global state
  const clusterReducer = useAppSelector(
    (state: IReducers) => state.clusterReducer
  );
  const apiReducer = useAppSelector((state: IReducers) => state.apiReducer);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const dbData = apiReducer.clusterDbData.find(
    (element) => element._id === props.id
  );

  const [clusterData, setClusterData] = useState({
    url: dbData?.url,
    k8_port: dbData?.k8_port,
    faas_port: dbData?.faas_port,
    name: dbData?.name,
    description: dbData?.description,
    faas_username: dbData?.faas_username,
    faas_password: dbData?.faas_password,
    faas_url: dbData?.faas_url || '',
    grafana_url: dbData?.grafana_url || '',
    kubeview_url: dbData?.kubeview_url || '',
  });
  const [updateClusterError, setUpdateClusterError] = useState('');

  const deleteClusterMutation = useMutation(
    (body: { clusterId: string | undefined }) => deleteCluster(body),
    {
      onSuccess: (response) => {
        if (response.deleted) {
          dispatch(setRender(!clusterReducer.render));
          props.refetch();
          props.handleModal(false);
        }
      },
    }
  );
  const editClusterMutation = useMutation((body: any) => editCluster(body), {
    onSuccess: (response) => {
      if (response.success) {
        setUpdateClusterError('Cluster successfully updated!');
        dispatch(setRender(!clusterReducer.render));
        props.refetch();
        props.handleModal(false);
      }
    },
  });
  const settingsField = {
    background: 'white',
    borderRadius: '5px',
    marginBlock: '7px',
    width: '300px',
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = e;
    setClusterData({ ...clusterData, [name]: value });
  };

  const handleDeleteCluster = async () => {
    try {
      deleteClusterMutation.mutate({
        clusterId: props.id,
      });
    } catch (err) {
      console.log('Delete cluster error:', err);
    }
  };

  const handleUpdateCluster = async () => {
    try {
      const payload = { ...clusterData, clusterId: props.id };
      if (
        payload.url === dbData?.url &&
        payload.k8_port === dbData?.k8_port &&
        payload.faas_port === dbData?.faas_port &&
        !payload.faas_username &&
        !payload.faas_password &&
        payload.name === dbData?.name &&
        payload.description === dbData?.description &&
        payload.faas_url === dbData?.faas_url &&
        payload.grafana_url === dbData?.grafana_url &&
        payload.kubeview_url === dbData?.kubeview_url
      ) {
        setUpdateClusterError('Nothing to update!');
        return;
      }
      if (!payload.faas_username || !payload.faas_password) {
        setUpdateClusterError('Both OpenFaaS credentials required');
        return;
      }
      if (
        !payload.k8_port?.toString().match(/[0-9]/g) ||
        !payload.faas_port?.toString().match(/[0-9]/g)
      ) {
        setUpdateClusterError('Port(s) must be numbers');
        return;
      }
      if (payload.name === dbData?.name) {
        setUpdateClusterError('Cluster name already exists. Try another name.');
        return;
      }
      editClusterMutation.mutate(payload);
    } catch (err) {
      console.log('Update cluster error:', err);
    }
  };

  const handleEnterKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') handleUpdateCluster();
  };

  return (
    <div>
      <Container
        className="module-container"
        component={Card}
        sx={{
          color: 'white',
          minHeight: '100%',
          minWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgb(0,0,0)',
          boxShadow: '1px 1px 10px .5px #403e54',
          borderRadius: '0px',
          marginBottom: '20px',
        }}
      >
        <div className="Module-top-row" style={{ marginBottom: '20px' }}>
          <div className="module-title noselect">
            Cluster Settings: {props.name}
          </div>
        </div>
        <div id="module-content">
          <Container
            sx={{
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div>
              <TextField
                onKeyDown={handleEnterKeyDown}
                onChange={handleInputChange}
                name=""
                value={clusterData?.url}
                id="update-cluster-url"
                type="text"
                label="Cluster URL"
                variant="filled"
                size="small"
                margin="dense"
                sx={settingsField}
              />
            </div>
            <div>
              <TextField
                onKeyDown={handleEnterKeyDown}
                onChange={handleInputChange}
                name="k8_port"
                value={clusterData?.k8_port}
                id="update-cluster-k8"
                type="text"
                label="Kubernetes Port"
                variant="filled"
                size="small"
                margin="dense"
                sx={settingsField}
              />
            </div>
            <div>
              <TextField
                onKeyDown={handleEnterKeyDown}
                onChange={handleInputChange}
                name="faas_port"
                value={clusterData?.faas_port}
                id="update-cluster-faas"
                type="text"
                label="FaaS Port"
                variant="filled"
                size="small"
                margin="dense"
                sx={settingsField}
              />
            </div>
            <div>
              <TextField
                onKeyDown={handleEnterKeyDown}
                onChange={handleInputChange}
                name="faas_username"
                value={clusterData?.faas_username}
                id="update-cluster-faas-username"
                type="text"
                label="FaaS Username"
                variant="filled"
                size="small"
                margin="dense"
                sx={settingsField}
              />
            </div>
            <div>
              <TextField
                onKeyDown={handleEnterKeyDown}
                onChange={handleInputChange}
                name="faas_password"
                value={clusterData?.faas_password}
                id="update-cluster-faas-password"
                type="text"
                label="FaaS Password"
                variant="filled"
                size="small"
                margin="dense"
                sx={settingsField}
              />
            </div>
            <div>
              <TextField
                onKeyDown={handleEnterKeyDown}
                onChange={handleInputChange}
                name="name"
                value={clusterData?.name}
                id="update-cluster-name"
                type="text"
                label="Cluster Name"
                variant="filled"
                size="small"
                margin="dense"
                sx={settingsField}
              />
            </div>
            <div>
              <TextField
                onKeyDown={handleEnterKeyDown}
                onChange={handleInputChange}
                name="description"
                value={clusterData?.description}
                id="update-cluster-description"
                type="text"
                label="Cluster Description"
                variant="filled"
                size="small"
                margin="dense"
                sx={settingsField}
              />
            </div>
            <div>
              <TextField
                id="openfaas-url"
                type="text"
                label="FaaS URL"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDown}
                onChange={handleInputChange}
                name="faas_url"
                value={clusterData?.faas_url}
                sx={settingsField}
              />
            </div>
            <div>
              <TextField
                id="grafana-url"
                type="text"
                label="Grafana URL"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDown}
                onChange={handleInputChange}
                name="grafana_url"
                value={clusterData?.grafana_url}
                sx={settingsField}
              />
            </div>
            <div>
              <TextField
                id="kubeview-url"
                type="text"
                label="Kubeview URL"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDown}
                onChange={handleInputChange}
                name="kubeview_url"
                value={clusterData?.kubeview_url}
                sx={settingsField}
              />
            </div>
            <div>{updateClusterError}</div>
          </Container>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-evenly',
              marginBottom: '7px',
            }}
          >
            <Button
              sx={{
                ':hover': { backgroundColor: 'red' },
              }}
              variant="text"
              id="basic-button"
              className="full-screen-button"
              onClick={handleDeleteCluster}
            >
              Delete
            </Button>
            <Button
              className="full-screen-button"
              variant="text"
              id="basic-button"
              onClick={handleUpdateCluster}
              sx={{ ':hover': { backgroundColor: 'green' } }}
            >
              Update
            </Button>
          </Box>
        </div>
      </Container>
    </div>
  );
};

export default ClusterSettings;
