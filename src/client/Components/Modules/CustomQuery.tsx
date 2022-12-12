import React, { useEffect, useState } from 'react';
import customMetric from '../../Queries/Custom';
import { Container, TextField, Button } from '@mui/material';
import { Modules } from '../../Interfaces/ICluster';
import loadable from '@loadable/component';
// import ReactJson from "react-json-view";

const ReactJson = loadable(() => import('react-json-view'));

const CustomQuery = (props: Modules) => {
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

  //remove previous session storage on first page load
  window.onbeforeunload = function () {
    sessionStorage.clear();
  };

  const localStore = () => {
    sessionStorage.setItem(
      'customQueryInput',
      (document.getElementById('query-input') as HTMLInputElement).value
    );
  };

  const handleCustom = async (): Promise<void> => {
    try {
      const query = (document.getElementById('query-input') as HTMLInputElement)
        .value;
      const outputQuery = await customMetric(props.id as string, 'k8', query);
      setData(outputQuery);
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
    <div className="iframeDiv">
      <iframe
        // src={`http://${grafIP}/d/${dashboard}/`}
        src="http://35.199.145.18/dashboard/new?orgId=1&edit/?&kiosk=tv"
        height="1000px"
        width="1200px"
        className="custom-graf"
        frameBorder="0"
      ></iframe>
      {/* <Container
      sx={{
        width: '100%',
        textAlign: 'center',
      }}
    >
      <div>
        <TextField
          onKeyDown={handleEnterKeyDown}
          onChange={localStore}
          id="query-input"
          type="text"
          defaultValue={
            sessionStorage.getItem('customQueryInput') || 'Input Custom Query'
          }
          label="Input Custom Query"
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
          sx={
            props.isDark
              ? {
                  background: '#c0c0c0',
                  color: '#1f2022',
                  borderRadius: '5px',
                  marginRight: '3px',
                  marginBottom: '20px',
                  width: '100%',
                  fontSize: '10px',
                }
              : {
                  background: '#3a4a5b',
                  borderRadius: '5px',
                  marginRight: '3px',
                  marginBottom: '20px',
                  width: '100%',
                  fontSize: '10px',
                }
          }
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
            fontSize: '13px',
          }}
        >
          <ReactJson src={data || { input: 'query' }} />
        </Container>
      </div>
    </Container> */}
    </div>
  );
};

export default CustomQuery;
