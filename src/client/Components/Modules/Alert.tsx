import React, { useEffect, useState} from 'react';
import ReactJson from 'react-json-view';
import alertAdd from '../../Queries/Alert';
import { Container, TextField, Button } from '@mui/material';
import { Modules } from '../../Interfaces/ICluster';
import path from 'path';
// import fs from 'fs';
import * as fs from 'fs';


import yaml from 'js-yaml';

const Alert = (props: Modules) => {
  const [data, setData] = useState<any[]>();
  const [responseStyle, setResponseStyle] = useState({
    color: 'white',
    height: '280px'
  });

  useEffect(() => {
    if (!props.nested) {
      setResponseStyle({
        ...responseStyle,
        color: '#F0F0F0',
        height: '65vh'
      });
    }
  }, []);

  const handleCustom = async () => {
    try {
      type AllInputsType = {
          name: string;
          expression: string;
          duration: string;
      }
      const allinputs: AllInputsType = {
        name:(document.getElementById('query-name') as HTMLInputElement).value,
        expression:(document.getElementById('query-expression') as HTMLInputElement).value,
        duration:(document.getElementById('query-duration') as HTMLInputElement).value
      };
      const outputQuery = await alertAdd(props.id as string, 'k8', allinputs as object);
      console.log(outputQuery);
    } catch (error){
      console.log(error);
    }
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleCustom();
  };

  return (
    <Container 
      sx={{
        width: '100%',
        textAlign: 'center'
      }}
    >
      <div>
        <TextField
          onKeyDown={handleEnterKeyDown}
          id='query-name'
          name='alert'
          type="text"
          label="Enter Alert Name"
          variant="filled"
          size='small'
          margin="dense"
          sx={{
            background: 'white',
            borderRadius: '5px',
            marginRight: '3px',
            marginBottom: '0px',
            width: '100%',
            fontSize: '10px'
          }}
        />
        <TextField
          onKeyDown={handleEnterKeyDown}
          id='query-expression'
          type="text"
          label="Enter Alert Expression"
          variant="filled"
          size='small'
          margin="dense"
          sx={{
            background: 'white',
            borderRadius: '5px',
            marginRight: '3px',
            marginBottom: '0px',
            width: '100%',
            fontSize: '10px'
          }}
        />
        <TextField
          onKeyDown={handleEnterKeyDown}
          id='query-duration'
          type="text"
          label="Enter Alert Duration"
          variant="filled"
          size='small'
          margin="dense"
          sx={{
            background: 'white',
            borderRadius: '5px',
            marginRight: '3px',
            marginBottom: '0px',
            width: '100%',
            fontSize: '10px'
          }}
        />
      </div>
      <div>
        <Button 
          variant="contained" 
          className="btn" 
          type="button" 
          onClick = {handleCustom}
          sx={{
            background: '#3a4a5b',
            borderRadius: '5px',
            marginRight: '3px',
            marginBottom: '20px',
            width: '100%',
            fontSize: '10px'
          }}
        >
          Add Custom Alert
        </Button>
      </div>
    </Container>
  );
};

export default Alert;