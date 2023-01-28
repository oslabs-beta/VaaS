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
import { idText } from 'typescript';
import { type } from 'os';

const textFieldStyle = {
  background: '#FFFFFF',
  borderRadius: '5px',
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
  width: '80%',
  fontSize: '10px',
  alignSelf: 'center',
};

const textFields: {
  id: string;
  type?: string;
  label: string;
  errMsg?: string;
  regex?: RegExp;
}[] = [
  { id: 'name', label: 'Cluster Name' },
  { id: 'description', label: 'Cluster Description' },
  { id: 'url', label: 'Prometheus URL' },
  { id: 'k8_port', label: 'Prometheus Port', regex: /[0-9]/g },
  { id: 'faas_username', type: 'username', label: 'FaaS Username' },
  { id: 'faas_password', type: 'password', label: 'FaaS Password' },
  { id: 'faas_url', label: 'Faas URL' },
  { id: 'faas_port', label: 'Faas Port', regex: /[0-9]/g },
  { id: 'grafana_url', label: 'Grafana URL' },
  { id: 'kubeview_url', label: 'Kubeview URL' },
  { id: 'cost_url', label: 'Kubecost URL' },
  { id: 'cost_port', label: 'Kubecost Port ', regex: /[0-9]/g },
];

const AddClusters = (props: { refetch: any; handleAddClusters: any }) => {
  // Dispatch hook to dispatch actions to the store
  const dispatch = useAppDispatch();
  // Select the uiReducer from the store
  const uiReducer = useAppSelector((state: IReducers) => state.uiReducer);
  // React hooks to maintain local state
  const [addClusterMessage, setAddClusterMessage] = useState('');
  const initialFormData: AddClusterType = {
    url: '',
    k8_port: '',
    faas_port: '',
    faas_username: '',
    faas_password: '',
    name: '',
    description: '',
    faas_url: '',
    grafana_url: '',
    kubeview_url: '',
    cost_url: '',
    cost_port: '',
  };

  const [formData, setFormData] = useState<any>(initialFormData);
  const [formErrors, setFormErrors] = useState<boolean[]>(
    textFields.map((ele) => false)
  );

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
      const newFormErrors = [...formErrors];
      let isValidInput = true;
      textFields.forEach((field, index) => {
        // If a field is missing set the status of that form to error status and display error message
        if (!formData[field.id]) {
          newFormErrors[index] = true;
          isValidInput = false;
          field.errMsg = `${field.label} is required.`;
          // If a port field is not a number, set that form to error status and display error message
        } else if (field.regex && !formData[field.id].match(field.regex)) {
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
        mutation.mutate(formData);
      }
    } catch (err) {
      console.log('Add cluster failed', err);
    }
  };
  const handleEnterKeyDownAddCluster = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') handleAddCluster();
  };

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
          height: 'fit-content',
          '@media screen and (max-width: 650px)': {
            maxWidth: '80vw',
            height: '510px',
          },
        }}
      >
        <h1 id="add-cluster-title">Add New Cluster</h1>
        <Grid
          component="form"
          id="add-cluster-form"
          container
          justifyContent="center"
          rowSpacing={1}
          columnSpacing={2}
        >
          {textFields.map(({ id, type, label, errMsg }, index) => {
            return (
              <Grid item>
                <TextField
                  id={id}
                  type={type || 'text'}
                  label={label}
                  variant="filled"
                  size="small"
                  // margin="dense"
                  helperText={formErrors[index] ? errMsg : null}
                  error={formErrors[index]}
                  onChange={(e) =>
                    setFormData({ ...formData, [id]: e.target.value })
                  }
                  onKeyDown={handleEnterKeyDownAddCluster}
                  sx={textFieldStyle}
                  key={`TextField ${index}`}
                />
              </Grid>
            );
          })}
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
