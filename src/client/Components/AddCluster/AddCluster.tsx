import React from 'react';
import { Post, Put } from '../../Services';
import { apiRoute } from '../../utils';
import NavBar from '../Home/NavBar';
import Box from '@mui/material/Box';
import  TextField  from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

const AddCluster = () => {
  const handleAdd = async () => {
    try {
      const body = {
        url: (document.getElementById('cluster-url') as HTMLInputElement).value,
        k8_port: (document.getElementById('k8_port') as HTMLInputElement).value,
        faas_port: (document.getElementById('faas_port') as HTMLInputElement).value,
        name: (document.getElementById('cluster-name') as HTMLInputElement).value,
        description: (document.getElementById('cluster-description') as HTMLInputElement).value,
      };
      await Post(apiRoute.getRoute('cluster'), body, { authorization: localStorage.getItem('token') });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    /*
    <Container sx={{
        height: '100vh',
        minWidth: '100%',
        justifyContent: 'center',
        display: 'flex',
        direction: 'column',
        textAlign: 'center',
        alignItems: 'center',
        backgroundSize: 'contain',
        bgcolor: '#3a4a5b',
        
      }} className="backdrop">
    */
    <div>
       <Container sx={{
        height: '100vh',
        minWidth: '100%',
        justifyContent: 'center',
        display: 'flex',
        direction: 'column',
        textAlign: 'center',
        alignItems: 'center',
        backgroundSize: 'contain',
        bgcolor: '#3a4a5b',
        
      }} className="backdrop">
      <Box
          maxWidth="sm" 
          className="login-container"
          sx={{
            width: '40%',
            opacity: '95%',
            direction: 'column',
            textAlign: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '1.5rem',
            borderRadius: '2%'
          }}
          >
      <h2>Add Cluster</h2>
            <TextField
              id="cluster-url"
              label="Cluster URL"
              type="username"
              variant="outlined"
              size='small'
              margin="dense"
          />
          <div>
            <TextField
              id="k8_port"
              label="Kubernetes Port"
              type="text"
              variant="outlined"
              size='small'
              margin="dense"
            />
          </div>
          <div>
            <TextField
              id="faas_port"
              label="FaaS Port"
              type="text"
              variant="outlined"
              size='small'
              margin="dense"
            />
          </div>
          <div>
            <TextField
              id="cluster-name"
              label="Cluster Name"
              type="text"
              variant="outlined"
              size='small'
              margin="dense"
            />
          </div>
          <div>
            <TextField
              id="cluster-description"
              label="Cluster Description"
              type="text"
              variant="outlined"
              size='small'
              margin="dense"
            />
          </div>
          <Button variant="contained" className="btn" type="button" onClick={handleAdd}>Add Cluster</Button>
      
      </Box>
      <NavBar />
      </Container>
    </div>
  );
};

/*
<p><input id='cluster-url' placeholder='url'/></p>
<p><input id='k8_port' placeholder='k8_port'/></p>
<p><input id='faas_port' placeholder='faas_port'/></p>
<p><input id='cluster-name' placeholder='cluster name'/></p>
<p><input id='cluster-description' placeholder='description'/></p>
<button onClick={handleAdd} type='button'>Add cluster</button>
<Button variant="contained" className="btn" type="button" onClick=onClick={handleAdd}>Add Cluster</Button>
*/

export default AddCluster;
