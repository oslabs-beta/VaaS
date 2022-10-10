import React, { useState, useEffect, ChangeEvent, memo } from "react";
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
import { functionCost } from "../../utils";

const FunctionCost = (props: Modules) => {
  const { state }: any = useLocation();
  const [id] = useState(props.id || state[0]);
  const OFReducer = useAppSelector((state: IReducers) => state.OFReducer);
  const deployedFunctions = OFReducer.deployedFunctions || [];
  const [selectedDeployedFunction, setSelectedDeployedFunction] = useState('');
  const [data, setData] = useState({value: 0});
  const [retrived, setRetrived] = useState(false);

  // function calculation state
  const [avgExecutionTime, setAvgExecutionTime] = useState<number | null>(0);
  const [numOfInvokation, setNumOfInvokation] = useState<number | null>(0); 
  const [memoryOfFunc, setMemoryOfFunc] = useState<number | null>(0); 

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
    console.log(typeof avgExecutionTime);

  }, [avgExecutionTime]);
  useEffect(() => {
    console.log('DATA IS: ', data);
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

      if (!isNaN(Number(data.value))) {
        data.value = `The average time needed to invoke function is ${ Number(data.value).toFixed(4)} seconds`; 
        console.log(data.vlaue);
        setData(data);
        setRetrived(true); 
      }
      else {
        data.value = 'Please invoke function first!'; 
        console.log(data.vlaue);
        setData(data);
        setRetrived(true);
      } 
    }
    catch (error) {
      console.log('ERROR IN handleFunctionData: ', error);
    }
  };

  const displayFunctionData = (name: string) => {
    return deployedFunctions.find((element) => element.name === name);
  };

  const handleCalculatorInput = (e: React.ChangeEvent<HTMLInputElement>, dataType: string): void => {
    switch (dataType) {
      case "numInvoke": {
        setNumOfInvokation(Number(e.target.value));
        break;
      }
      case "timeInvoke": {
        setAvgExecutionTime(Number(e.target.value));
        break;
      }
      case "memory": {
        setMemoryOfFunc(Number(e.target.value));
        break;
      }
    }
  };



  const lambdaFuncCost = (invokeAmount: number, invokeTime: number, memory: number, resultType: string) => {
    if (invokeAmount > functionCost.lambdaFreeRequests) {
      const requestTimesTime = (invokeAmount - functionCost.lambdaFreeRequests) * (invokeTime / 1000);
      const computeInsec = Math.max(requestTimesTime - functionCost.lambdaFreeTier, 0); 
    // console.log(computeInsec);
    const totalComputeGBSeconds = (computeInsec) * (memory / 1024);
    // console.log('total seconds:', totalComputeGBSeconds);
    const bill = totalComputeGBSeconds * functionCost.lambdaChargeGBSecond;
    // console.log('BILL WITH SECONDS IS', bill)
    // console.log('functionCost', functionCost.lambdaRequestCharge)
      const requestCharge: number = (invokeAmount - functionCost.lambdaFreeRequests) * (functionCost.lambdaRequestCharge / 1000000);
      // console.log(`invoked amount: ${invokeAmount},minus freetier amount: ${functionCost.lambdaFreeRequests}, times charge per request ${functionCost.lambdaRequestCharge / 1000000}`);
      // console.log('REQ CHARGE TOT:' , requestCharge)
      const totalCost: string = (requestCharge + bill).toFixed(2);
      const result = {
        requestCharge: requestCharge,
        computeCost: bill,
        total: totalCost
      };
      // console.log(totalCost);
      // console.log('****************');
      switch (resultType) {
        case "reqCharge": {
          return result.requestCharge.toFixed(2); 
           
        }
        case "computeCost": {
          return result.computeCost.toFixed(2); 
        }
        case 'total': {
          return result.total; 
        }
      }
    }
    else return 0; 
    

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
          {
            retrived &&
            <div>
              <div>{data.value} </div>
              <div>This function has been invoked {displayFunctionData(selectedDeployedFunction)?.invocationCount || 0} times</div>
             
            </div>
          }
  
          <div>Estimated AWS Cost of deployment:

          <form className="costCal">
              <TextField size='small' id="filled-basic"
                label="# of invokation" variant="filled"
                onChange={(newValue: React.ChangeEvent<HTMLInputElement> ):void => handleCalculatorInput(newValue, 'numInvoke',)}>
              </TextField>
              <TextField size='small' id="filled-basic"
                label="Estimated Execution Time (ms)" variant="filled"
                onChange={(newValue: React.ChangeEvent<HTMLInputElement> ):void => handleCalculatorInput(newValue, 'timeInvoke')}>
              </TextField>
  
              <TextField size='small' id="filled-basic"
                label="memory in mbs" variant="filled"
                onChange={(newValue: React.ChangeEvent<HTMLInputElement> ):void => handleCalculatorInput(newValue , 'memory')}>
              </TextField>
              
          </form> 
          <table>
            <tbody>
              <tr>
                <th>Vendor</th>
                <th>Request Cost</th>
                <th>Compute Cost</th>
                <th>Total</th>
                </tr>
              <tr>
					<td>AWS Lambda</td>
                  <td>$<span id="lambda-request-cost">{lambdaFuncCost(numOfInvokation as number,avgExecutionTime as number ,memoryOfFunc as number, 'reqCharge') }</span></td>
					<td>$<span id="lambda-execution-cost">{lambdaFuncCost(numOfInvokation as number,avgExecutionTime as number ,memoryOfFunc as number, 'computeCost') }</span></td>
					<th>$<span id="lambda-total-cost">{lambdaFuncCost(numOfInvokation as number,avgExecutionTime as number ,memoryOfFunc as number, 'total') }</span>
				</th></tr>
				{/* <tr>
					<td>Azure Functions</td>
					<td>$<span id="azure-request-cost">-</span></td>
					<td>$<span id="azure-execution-cost">-</span></td>
					<th>$<span id="azure-total-cost">-</span>
				</th></tr>
				<tr>
					<td>Google Cloud Functions</td>
					<td>$<span id="google-request-cost">-</span></td>
					<td>$<span id="google-execution-cost">-</span></td>
					<th>$<span id="google-total-cost">-</span>
				</th></tr>
				<tr>
					<td>IBM OpenWhisk</td>
					<td>$<span id="ibm-request-cost">-</span></td>
					<td>$<span id="ibm-execution-cost">-</span></td>
					<th>$<span id="ibm-total-cost">-</span>
				</th></tr> */}
			</tbody></table>
      
          </div>

        </Box>
    </Box>
    </Container>
  );

}; 
export default FunctionCost;
