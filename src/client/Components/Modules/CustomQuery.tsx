import React, { useState} from 'react';
import ReactJson from 'react-json-view';
import customMetric from '../../Queries/Custom';
import { Container, TextField, Button } from '@mui/material';
import { Modules } from '../../Interfaces/ICluster';

const CustomQuery = (props: Modules) => {
  const [data, setData] = useState<any[]>();

  const handleCustom = async (): Promise<void> => {
    try {
      const query = (document.getElementById('query-input') as HTMLInputElement).value;
      const outputQuery = await customMetric(props.id as string, 'k8', query);
      setData(outputQuery);
    } catch (error){
      console.log(error);
    }
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleCustom();
  };

  return (
    <Container className='custom-query'>
      <div>
        <TextField
          onKeyDown={handleEnterKeyDown}
          id='query-input'
          type="text"
          label="Input Custom Query"
          variant="filled"
          size='small'
          margin="dense"
          sx={{
            background: 'white',
            borderRadius: '5px',
            marginRight: '3px',
            marginBottom: '0px',
            width: '350px',
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
            marginBottom: '0px',
            width: '350px',
            fontSize: '10px'
          }}
        >
          Invoke Custom Query
        </Button>
      </div>
      {
        data && 
        <div>
          <ReactJson src={data}/>
        </div>
      }
    </Container>
  );
};

export default CustomQuery;