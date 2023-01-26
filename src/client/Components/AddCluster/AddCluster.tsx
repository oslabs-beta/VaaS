import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AddClusterType, IReducers } from '../../Interfaces';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import {
  addCluster,
  fetchUser,
} from '../../Queries';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import './styles.css';

// Define the Admin type, setting types for the properties
// Associated with Admin accounts
type AddClusters = {
  url: string;
  k8_port: number;
  faas_port: number;
  faas_password: string;
  faas_username: string;
  name: string;
  cluster_description: string;
  faas_url: string;
  grafana_url: string;
  kubeview_url: string;
  //  refetch: any,
  //  handleAddClusters: any
};

const containerStyle = {
  width: '550px',
  marginTop: '15px',
  innerHeight: '30px',
  color: 'black',
};
const textFieldStyle = {
  background: '#FFFFFF',
  borderRadius: '5px',
  marginBottom: '0px',
  width: '295px',
  fontSize: '10px',
  color: 'white',
  links: {
    padding: '0 50px',
    color: 'white',
    '&:hover': {
      textDecorationColor: 'green',
      cursor: 'pointer',
    },
  },
};
const buttonStyle = {
  background: '#3a4a5b',
  borderRadius: '5px',
  marginBottom: '0px',
  width: '100%',
  fontSize: '10px',
};

const AddClusters = (props: { refetch: any; handleAddClusters: any }) => {
  // Dispatch hook to dispatch actions to the store
  const dispatch = useAppDispatch();
  // Select the uiReducer from the store
  const uiReducer = useAppSelector((state: IReducers) => state.uiReducer);

  // React hooks to maintain local state
  const [addClusterMessage, setAddClusterMessage] = useState('');
  const [currUser, setCurrUser] = useState<AddClusters | unknown>({});
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  // fetch Query
  const { data: userData, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });
  useEffect(() => {
    setCurrUser(userData);
  }, [userData]);

  // React query mutations used for requests other than get requests, used to get more efficient requests
  const mutation = useMutation((data: AddClusterType) => addCluster(data), {
    onSuccess: (response) => {
      response.success
        ? setAddClusterMessage('Successfully added cluster')
        : setAddClusterMessage(response.message);
      props.refetch();
      props.handleAddClusters(false);
    },
  });

  // handler functions
  const handleAddCluster = async (): Promise<void> => {
    try {
      const body = {
        url: (document.getElementById('cluster-url') as HTMLInputElement).value,
        k8_port: (document.getElementById('k8_port') as HTMLInputElement).value,
        faas_port: (document.getElementById('faas_port') as HTMLInputElement)
          .value,
        faas_username: (
          document.getElementById('faas_username') as HTMLInputElement
        ).value,
        faas_password: (
          document.getElementById('faas_password') as HTMLInputElement
        ).value,
        name: (document.getElementById('cluster-name') as HTMLInputElement)
          .value,
        description: (
          document.getElementById('cluster-description') as HTMLInputElement
        ).value,
        faas_url: (document.getElementById('openfaas-url') as HTMLInputElement)
          .value,
        grafana_url: (
          document.getElementById('grafana-url') as HTMLInputElement
        ).value,
        kubeview_url: (
          document.getElementById('kubeview-url') as HTMLInputElement
        ).value,
        cost_Url: (document.getElementById('cost_Url') as HTMLInputElement)
          .value,
        cost_port: (document.getElementById('cost_port') as HTMLInputElement)
          .value,
      };
      const arr: string[] = [
        body.url,
        body.k8_port,
        body.faas_port,
        body.name,
        body.description,
        body.faas_url,
        body.grafana_url,
        body.kubeview_url,
      ];
      if (
        !body.url ||
        !body.k8_port ||
        !body.faas_port ||
        !body.name ||
        !body.description ||
        !body.faas_url ||
        !body.grafana_url ||
        !body.kubeview_url ||
        !body.cost_Url ||
        !body.cost_port
      ) {
        setAddClusterMessage('Missing input fields');
        return;
      }
      for (let i = body.url.length - 1; i >= 0; i--) {
        if (body.url[i] === '/') {
          body.url = body.url.replace('/', '');
        }
      }
      for (let i = body.faas_url.length - 1; i >= 0; i--) {
        if (body.faas_url[i] === '/') {
          body.faas_url = body.faas_url.replace('/', '');
        }
      }
      for (let i = body.grafana_url.length - 1; i >= 0; i--) {
        if (body.grafana_url[i] === '/') {
          body.grafana_url = body.grafana_url.replace('/', '');
        }
      }
      if (!body.k8_port.match(/[0-9]/g) || !body.faas_port.match(/[0-9]/g)) {
        setAddClusterMessage('Port(s) must be numbers');
        return;
      }
      mutation.mutate(body);
    } catch (err) {
      console.log('Add cluster failed', err);
    }
  };
  const handleEnterKeyDownAddCluster = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') handleAddCluster();
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    //    <Box id='tenOptions' >
    //     <div id='container '>
    //     <div id='cluster-url'>
    //     <p id='pid2'>Prometheus URL:</p>
    //     <form >
    // <input
    //       id="cluster-url"
    //       className='groupOne'
    //       type="text"
    //       placeholder="Prometheus URL"
    //     />
    //      <p id='pid2'>Prometheus port:</p>
    //     <input
    //       id="k8_port"
    //       className='groupOne'
    //       type="text"
    //       placeholder="9090"
    //     />
    //     <p id='pid2'>FaaS port:</p>
    //     <input
    //       id="faas_port"
    //       className='groupOne'
    //       type="text"
    //       placeholder="8080"
    //       onKeyDown={handleEnterKeyDownAddCluster}
    //     />
    //     <p id='pid2'>Faas Username:</p>
    //     <input
    //       id="faas_username"
    //       className='groupOne'
    //       type="username"
    //       placeholder="FaaS Username"
    //       onKeyDown={handleEnterKeyDownAddCluster}
    //     />
    //     <p id='pid2'>Faas Password:</p>
    //     <input
    //       id="faas_password"
    //       className='groupOne'
    //       type="password"
    //       placeholder="FaaS Password"
    //       onKeyDown={handleEnterKeyDownAddCluster}
    //     />
    //     <p id='pid2'>Cluster Name:</p>
    //     <input
    //       id="cluster-name"
    //       className='groupOne'
    //       type="text"
    //       placeholder="Cluster Name"
    //       onKeyDown={handleEnterKeyDownAddCluster}
    //     />
    //      <p id='pid'>Cluster Description:</p>
    //     <input
    //       id="cluster-description"
    //       className='groupTwo'
    //       type="text"
    //       placeholder="Cluster Description"
    //       onKeyDown={handleEnterKeyDownAddCluster}
    //     />
    //     <p id='pid'>Faas Url:</p>
    //     <input
    //       id="openfaas-url"
    //       className='groupTwo'
    //       type="text"
    //       placeholder="FaaS URL"
    //       onKeyDown={handleEnterKeyDownAddCluster}
    //     />
    //      <p id='pid'>Grafana Url:</p>
    //     <input
    //       id="grafana-url"
    //       className='groupTwo'
    //       placeholder="Grafana URL"
    //       onKeyDown={handleEnterKeyDownAddCluster}
    //     />
    //     <p id='pid' > Cost url</p>
    //     <input
    //     id='cost-url'
    //     className='groupTwo'
    //     placeholder='Cost url'
    //     onKeyDown={handleEnterKeyDownAddCluster}
    //     />
    //        <p id='pid' > Cost port</p>
    //     <input
    //     id='cost port'
    //     className='groupTwo'
    //     placeholder='Cost port'
    //     onKeyDown={handleEnterKeyDownAddCluster}
    //     />
    //     <p id='pid'>KubeView Url:</p>
    //     <input
    //       id="kubeview-url"
    //       className='groupTwo'
    //       type="text"
    //       placeholder="Kubeview URL"
    //       onKeyDown={handleEnterKeyDownAddCluster}
    //     />
    //     </form>
    //       <button className="btn" type="button" onClick={handleAddCluster}>
    //         Add Cluster
    //       </button>
    //       <div id="add-cluster-msg">{addClusterMessage}</div>
    //     </div>
    //     </div>
    //   </Box>
    <>
      <Box
        id="tenOptions"
        sx={{
          backgroundColor: 'grey',
          color: 'black',
          border: '1px solid black',
          // },
          margin: '0.5rem 0rem 0.6rem 0rem',
          fontWeight: 'bold',
          fontFamily: 'Verdana, Arial, sans-serif',
          fontSize: '1em',
          width: '630px',
          gap: '.6em',
          height: '675px',
          '@media screen and (max-width: 650px)': {
            maxWidth: '60vw',
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid container item xs={6} direction="column">
            <div className="one">
              {/* <p id='pid'>Prometheus URL:</p> */}
              <TextField
                id="cluster-url"
                type="text"
                label="Prometheus URL"
                variant="filled"
                size="small"
                margin="dense"
                sx={textFieldStyle}
              />
              {/* <p id='pid'>Prometheus port:</p> */}
              <TextField
                id="k8_port"
                type="text"
                defaultValue={'9090'}
                label="Prometheus port"
                variant="filled"
                size="small"
                margin="dense"
                sx={textFieldStyle}
              />
              {/* <p id='pid'>FaaS port:</p> */}
              <TextField
                id="faas_port"
                type="text"
                label="FaaS Port"
                defaultValue={'8080'}
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              {/* <p id='pid'>Faas Username:</p> */}
              <TextField
                id="faas_username"
                type="username"
                label="FaaS Username"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              {/* <p id='pid'>Faas Password:</p> */}
              <TextField
                id="faas_password"
                type="password"
                label="FaaS Password"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              {/* <p id='pid'>Cluster Name:</p> */}
              <TextField
                id="cluster-name"
                type="text"
                label="Cluster Name"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
            </div>
          </Grid>
          <Grid container item xs={6} direction="column">
            <div className="Two">
              {/* <p id='pid'>Cluster Description:</p> */}
              <TextField
                id="cluster-description"
                type="text"
                label="Cluster Description"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              {/* <p id='pid'>Faas Url:</p> */}
              <TextField
                id="openfaas-url"
                type="text"
                label="FaaS URL"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              {/* <p id='pid'>Grafana Url:</p> */}
              <TextField
                id="grafana-url"
                type="text"
                label="Grafana URL"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              {/* <p id='pid'>KubeView Url:</p> */}
              <TextField
                id="kubeview-url"
                type="text"
                label="Kubeview URL"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              {/* <p id='pid'> Cost port:</p> */}
              <TextField
                id="cost_port"
                type="text"
                label="Kubecost Port"
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
              {/* <p id='pid'> Cost Url:</p> */}
              <TextField
                id="cost_Url"
                type="text"
                label="Kubecost URL"
                defaultValue={'9090'}
                variant="filled"
                size="small"
                margin="dense"
                onKeyDown={handleEnterKeyDownAddCluster}
                sx={textFieldStyle}
              />
            </div>
            <div></div>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          className="btn"
          type="button"
          onClick={handleAddCluster}
          sx={buttonStyle}
        >
          Add Cluster
        </Button>
        <div id="add-cluster-msg">{addClusterMessage}</div>
      </Box>
    </>
  );
};
export default AddClusters;