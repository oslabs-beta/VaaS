import React, { useState, useEffect, ChangeEvent } from "react";
import { Modules } from "../../Interfaces/ICluster";
import { Get } from "../../Services";
import openFaasMetric from "../../Queries/OpenFaaS";
import { apiRoute } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../Store/hooks";
import { useLocation } from "react-router-dom";
import { IReducers } from "../../Interfaces/IReducers";
import { Container, TextField, Button , Box, FormControl, NativeSelect} from '@mui/material';
import { stringify } from "querystring";
import { flexbox } from "@mui/system";
import { ConnectingAirportsOutlined } from "@mui/icons-material";


const FunctionCost = (props: Modules) => {
  const { state }: any = useLocation();
  const [id] = useState(props.id || state[0]);
  const OFReducer = useAppSelector((state: IReducers) => state.OFReducer);
  const deployedFunctions = OFReducer.deployedFunctions || [];
  const [selectedDeployedFunction, setSelectedDeployedFunction] = useState('');
  const [data, setData] = useState({});
  const [responseStyle, setResponseStyle] = useState({
    color: 'white',
    height: '280px'
  });
  const [dropdownStyle] = useState({
    background: 'white',
    borderRadius: '5px',
    padding: '0.5rem',
    marginBottom: '0px',
    width: '100%',
    fontSize: '10px'
  });
  const [inputStyle] = useState({
    width: '45%',
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'center'

  });

  useEffect(() => {
    if (!props.nested) {
      setResponseStyle({
        ...responseStyle,
        color: '#F0F0F0',
        height: '65vh'
      });
    }
    console.log(localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    console.log('DATA IS: ',data)
  }, [data]);
  
  // pick the function we want to see
  const handleDeployedFunctionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeployedFunction(e.target.value);
  };

  // fetch data from prom: time it takes for exection, invocation amount
  const hadleFunctionData = async () => {
    try {
      console.log('CLICKEDDDDD');
      const type = 'avg';
      const query = `gateway_functions_seconds_sum{function_name="${selectedDeployedFunction}.openfaas-fn"}/gateway_function_invocation_total{function_name="${selectedDeployedFunction}.openfaas-fn"}`;
      const data = await openFaasMetric.avgTimePerInvoke(props.id as string, type, query);
      console.log(data.value);
      setData(data);
      
    }
    catch (error) {
      console.log('ERROR IN handleFunctionData: ', error);
    }
  };

  return (
    <Container
      sx={{
        width: '100%',
        textAlign: 'center'
      }}
    >

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginLeft: '-1rem',
        marginTop: '8px',
        justifyContent: 'center'
        }}
    >
        <Box
          sx={inputStyle}
        >
          <FormControl fullWidth
            sx={dropdownStyle}
          >
            <NativeSelect
              placeholder="Select OpenFaaS function"
              inputProps={{
                name: 'Deployed Functions',
                id: 'uncontrolled-native',
              }}
              onChange={handleDeployedFunctionChange}
            >
            <option value=''>--Select OpenFaaS Function--</option>
            {deployedFunctions.map((element, idx) => {
                  return (
                    <option 
                      key={idx} 
                      value={element.name}
                    >
                      {element.name}
                    </option>
                  );
            })}
            </NativeSelect>
          </FormControl>
        <Button
          variant="contained" 
          className="btn" 
          type="button"
          onClick={hadleFunctionData}
          sx={{
            background: '#3a4a5b',
            borderRadius: '5px',
            marginBottom: '20px',
            width: '25%',
            height: '2.5vh',
            fontSize: '10px',
            marginLeft: '0.5rem'
          }}
        >
        Calculate
        </Button>
        </Box>
        <Box
           sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            marginLeft: '-1rem',
            marginTop: '8px',
            justifyContent: 'center'
          }}
        >
          <div>THIS IS SELECTED {selectedDeployedFunction}</div>
          {/* {
            data.value &&
            <div>THIS IS THE VALUE { data. value}</div>
          }
           */}
          <div>THIS IS THE VALUE  </div>

        </Box>
    </Box>
    </Container>
  );

}; 
export default FunctionCost;
