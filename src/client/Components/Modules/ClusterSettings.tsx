import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { setRender } from '../../Store/actions';
import { Modules } from '../../Interfaces/ICluster';
import { IReducers } from '../../Interfaces/IReducers';
import { deleteCluster, editCluster } from '../../Queries';
import Container from '@mui/system/Container';
import { Box, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const textFields: {
  name: string;
  id: string;
  label: string;
  type?: string;
  regex?: RegExp;
  errMsg?: string;
  notRequired?: boolean;
}[] = [
  { name: 'name', id: 'update-cluster-name', label: 'Cluster Name' },
  {
    name: 'description',
    id: 'update-cluster-description',
    label: 'Cluster Description',
  },
  { name: 'url', id: 'update-cluster-url', label: 'Prometheus URL' },
  {
    name: 'k8_port',
    id: 'update-cluster-k8',
    label: 'Prometheus Port',
    regex: /[0-9]/g,
  },
  { name: 'faas_url', id: 'openfaas-url', label: 'OpenFaaS URL' },
  {
    name: 'faas_port',
    id: 'update-cluster-faas',
    label: 'OpenFaaS Port',
    regex: /[0-9]/g,
  },
  {
    name: 'faas_username',
    id: 'update-cluster-faas-username',
    label: 'OpenFaaS Username',
    notRequired: true,
  },
  {
    name: 'faas_password',
    id: 'update-cluster-faas-password',
    label: 'OpenFaaS Password',
    type: 'password',
    notRequired: true,
  },
  { name: 'grafana_url', id: 'grafana-url', label: 'Grafana URL' },
  { name: 'kubeview_url', id: 'kubeview-url', label: 'Kubeview URL' },
  { name: 'cost_url', id: 'kubecost-url', label: 'Kubecost URL' },
  {
    name: 'cost_port',
    id: 'kubecost-port',
    label: 'Kubecost Port',
    regex: /[0-9]/g,
  },
];

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

  const [clusterData, setClusterData] = useState<Record<any, any>>({
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
    cost_url: dbData?.cost_url || '',
    cost_port: dbData?.cost_port || '',
  });
  const [updateClusterError, setUpdateClusterError] = useState('');
  const [formErrors, setFormErrors] = useState<boolean[]>(
    Object.values(clusterData).map((ele) => false)
  );

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
      const newFormErrors = [...formErrors];
      let isValidInput = true;
      textFields.forEach((field, index) => {
        // If a field is missing set the status of that form to error status and display error message
        if (!field.notRequired && !clusterData[field.name]) {
          newFormErrors[index] = true;
          isValidInput = false;
          field.errMsg = `${field.label} is required.`;
          // If a port field is not a number, set that form to error status and display error message
        } else if (
          field.regex &&
          !clusterData[field.name].toString().match(field.regex)
        ) {
          newFormErrors[index] = true;
          isValidInput = false;
          field.errMsg = `Ports should be a number.`;
          // Set all properly filled forms to normal status
        } else {
          newFormErrors[index] = false;
          field.errMsg = undefined;
        }
      });
      setFormErrors(newFormErrors);
      // Only post data to server if all forms are properly filled out
      if (isValidInput) {
        const payload = { ...clusterData, clusterId: props.id };
        Object.entries(payload).forEach(([key, value]) => {
          if (typeof value === 'string' && value?.slice(-1) === '/')
            //@ts-ignore
            payload[key] = value.slice(0, -1);
        });
        editClusterMutation.mutate(payload);
      }
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
    <Container
      className="module-container"
      sx={{
        color: 'white',
        maxHeight: '650px',
        backgroundColor: 'rgb(0,0,0)',
        boxShadow: '1px 1px 10px .5px rgba(248, 245, 245, 0.5)',
        borderRadius: '10px',
        marginBottom: '20px',
        overflow: 'scroll',
      }}
    >
      <div className="Module-top-row" style={{ marginBottom: '20px' }}>
        <div className="module-title noselect">
          Cluster Settings: {props.name}
        </div>
      </div>
      <Grid
        container
        sx={{
          textAlign: 'center',
          maxWidth: { xs: '350px', xl: '650px' },
        }}
      >
        {textFields.map(({ name, id, label, errMsg, type }, index) => {
          return (
            <Grid item xs={12} xl={6} key={`ChangeField${index}`}>
              <TextField
                onKeyDown={handleEnterKeyDown}
                onChange={handleInputChange}
                name={name}
                value={clusterData[name]}
                id={id}
                label={label}
                helperText={formErrors[index] ? errMsg : null}
                error={formErrors[index]}
                type={type || 'text'}
                variant="filled"
                size="small"
                sx={settingsField}
              />
            </Grid>
          );
        })}
        <div>{updateClusterError}</div>
      </Grid>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          marginBottom: '7px',
        }}
      >
        <Button
          sx={{
            color: '#f5f5f5',
            ':hover': { backgroundColor: 'red' },
          }}
          variant="text"
          className="full-screen-button"
          onClick={handleDeleteCluster}
        >
          Delete
        </Button>
        <Button
          className="full-screen-button"
          variant="text"
          onClick={handleUpdateCluster}
          sx={{ color: '#f5f5f5', ':hover': { backgroundColor: 'green' } }}
        >
          Update
        </Button>
      </Box>
    </Container>
  );
};

export default ClusterSettings;
