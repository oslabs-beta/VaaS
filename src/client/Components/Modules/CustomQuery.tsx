import React, { useEffect, useState} from 'react';
import ReactJson from 'react-json-view';
import customMetric from '../../Queries/Custom';
import { Container, TextField, Button } from '@mui/material';
import { Modules } from '../../Interfaces/ICluster';

const CustomQuery = (props: Modules) => {
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
    <Container 
      sx={{
        width: '100%',
        textAlign: 'center'
      }}
    >
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
          Invoke Custom Query
        </Button>
        <Container
          sx={{
            backgroundColor: responseStyle.color,
            height: responseStyle.height,
            width: '100%',
            overflow: 'scroll',
            padding: '1rem',
            borderRadius: '15px',
            textAlign: 'left',
            fontSize: '13px'
          }}
        >
          <ReactJson src={data || {input: 'query'}} />
        </Container>
      </div>
    </Container>
  );
};

export default CustomQuery;