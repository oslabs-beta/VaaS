import React, { useEffect, useState } from 'react';
import alertAdd from '../../Queries/Alert';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { Modules } from '../../Interfaces/ICluster';
import path from 'path';
import loadable from '@loadable/component';

import yaml from 'js-yaml';

const ReactJson = loadable(() => import('react-json-view'));

const Alert = (props: Modules) => {
  const [data, setData] = useState<any[]>();
  const [responseStyle, setResponseStyle] = useState({
    color: 'white',
    height: '280px',
  });

  useEffect(() => {
    if (!props.nested) {
      setResponseStyle({
        ...responseStyle,
        color: '#F0F0F0',
        height: '65vh',
      });
    }
  }, []);

  const handleCustom = async () => {
    try {
      type AllInputsType = {
        name: string;
        expression: string;
        duration: string;
      };
      const allinputs: AllInputsType = {
        name: (document.getElementById('query-name') as HTMLInputElement).value,
        expression: (
          document.getElementById('query-expression') as HTMLInputElement
        ).value,
        duration: (
          document.getElementById('query-duration') as HTMLInputElement
        ).value,
      };
      const outputQuery = await alertAdd(
        props.id as string,
        'k8',
        allinputs as object
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleEnterKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter') handleCustom();
  };

  return (
    <Container
      sx={{
        width: '100%',
        textAlign: 'center',
      }}
    >
      <div>
        <TextField
          onKeyDown={handleEnterKeyDown}
          id="query-name"
          name="alert"
          type="text"
          label="Enter Alert Name"
          variant="filled"
          size="small"
          margin="dense"
          sx={{
            background: 'white',
            borderRadius: '5px',
            marginRight: '3px',
            marginBottom: '0px',
            width: '100%',
            fontSize: '10px',
          }}
        />
        <TextField
          onKeyDown={handleEnterKeyDown}
          id="query-expression"
          type="text"
          label="Enter Alert Expression"
          variant="filled"
          size="small"
          margin="dense"
          sx={{
            background: 'white',
            borderRadius: '5px',
            marginRight: '3px',
            marginBottom: '0px',
            width: '100%',
            fontSize: '10px',
          }}
        />
        <TextField
          onKeyDown={handleEnterKeyDown}
          id="query-duration"
          type="text"
          label="Enter Alert Duration"
          variant="filled"
          size="small"
          margin="dense"
          sx={{
            background: 'white',
            borderRadius: '5px',
            marginRight: '3px',
            marginBottom: '0px',
            width: '100%',
            fontSize: '10px',
          }}
        />
      </div>
      <div>
        <Button
          variant="contained"
          className="btn"
          type="button"
          onClick={handleCustom}
          sx={{
            background: '#3a4a5b',
            borderRadius: '5px',
            marginRight: '3px',
            marginBottom: '20px',
            width: '100%',
            fontSize: '10px',
          }}
        >
          Add Custom Alert
        </Button>
      </div>
    </Container>
  );
};

export default Alert;
