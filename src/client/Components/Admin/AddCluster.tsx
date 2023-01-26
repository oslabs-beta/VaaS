import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AddClusterType, IReducers } from '../../Interfaces';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { addCluster, fetchUser } from '../../Queries';
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
  cost_Url: string;
  cost_port: string;
  //  refetch: any,
  //  handleAddClusters: any
};

// const containerStyle = {
//   // width: '550px',
//   marginTop: '15px',
//   innerHeight: '30px',
//   color: 'black',
// };

const textFieldStyle = {
  background: '#FFFFFF',
  borderRadius: '5px',
  // marginBottom: '0px',
  // width: '90%',
  // margin: '3px 10px 3px 10px',
  fontSize: '10px',
  color: 'white',
  // alignSelf: 'center',
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
  width: '80%',
  fontSize: '10px',
  alignSelf: 'center',
};

const AddClusters = (props: { refetch: any; handleAddClusters: any }) => {
  // Dispatch hook to dispatch actions to the store
  const dispatch = useAppDispatch();
  // Select the uiReducer from the store
  const uiReducer = useAppSelector((state: IReducers) => state.uiReducer);

  // React hooks to maintain local state
  const [addClusterMessage, setAddClusterMessage] = useState('');
  const [currUser, setCurrUser] = useState<AddClusters | unknown>({});
  // const [value, setValue] = React.useState(0);
  // const navigate = useNavigate();
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

      if (body.url[body.url.length - 1] === '/')
        body.url = body.url.substring(0, body.url.length - 1);

      if (body.faas_url[body.faas_url.length - 1] === '/')
        body.faas_url = body.faas_url.substring(0, body.faas_url.length - 1);

      if (body.grafana_url[body.grafana_url.length - 1] === '/')
        body.grafana_url = body.grafana_url.substring(
          0,
          body.grafana_url.length - 1
        );
      if (body.cost_Url[body.cost_Url.length - 1] === '/')
        body.cost_Url = body.cost_Url.substring(0, body.cost_Url.length - 1);

      if (
        !body.k8_port.match(/[0-9]/g) ||
        !body.faas_port.match(/[0-9]/g) ||
        !body.cost_port.match(/[0-9]/g)
      ) {
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
  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setValue(newValue);
  // };
  console.log('add cluster message', addClusterMessage);
  return (
    <>
      <Box
        id="tenOptions"
        sx={{
          padding: '0px',
          display: 'flex',
          position: 'fixed',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: 'rgb(0,0,0)',
          borderRadius: '10px',
          color: 'black',
          border: '1px solid black',
          margin: '0.5rem 0rem 0.6rem 0rem',
          fontWeight: 'bold',
          fontFamily: 'Verdana, Arial, sans-serif',
          boxShadow: '1px 1px 10px 5px #403e54',
          fontSize: '1em',
          width: '600px',
          gap: '.6em',
          height: '480px',
          '@media screen and (max-width: 650px)': {
            maxWidth: '80vw',
            height: '510px',
          },
        }}
      >
        <h1 id="add-cluster-title">Add New Cluster</h1>
        <Grid container spacing={3} direction="row" justifyContent="center">
          <Grid container item xs={5} direction="column">
            {/* <div className="one"> */}
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
            <TextField
              id="cluster-url"
              type="text"
              label="Prometheus URL"
              variant="filled"
              size="small"
              margin="dense"
              sx={textFieldStyle}
            />
            <TextField
              id="k8_port"
              type="text"
              defaultValue={'9090'}
              label="Prometheus Port"
              variant="filled"
              size="small"
              margin="dense"
              sx={textFieldStyle}
            />
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
            {/* </div> */}
          </Grid>
          <Grid container item xs={5} direction="column">
            {/* <div className="Two"> */}
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
            <TextField
              id="cost_port"
              type="text"
              label="Kubecost Port"
              defaultValue={'9090'}
              variant="filled"
              size="small"
              margin="dense"
              onKeyDown={handleEnterKeyDownAddCluster}
              sx={textFieldStyle}
            />
            {/* </div> */}
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
