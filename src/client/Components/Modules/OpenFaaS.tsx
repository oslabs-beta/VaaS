import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Modules } from '../../Interfaces/ICluster';
import { FunctionTypes } from '../../Interfaces/IFunction';
import { IReducers } from '../../Interfaces/IReducers';
import { Delete, Get, Post } from '../../Services';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { GET_DeployedOFFunc, DEL_DeployedOFFunc } from '../../Store/actions';
import { apiRoute, customFuncBody } from '../../utils';
import Container from '@mui/material/Container';
import { DeployedFunctionTypes } from '../../Interfaces/IFunction';
import { Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import './styles.css';

const OpenFaaS = (props: Modules) => {
  //function to update redux store
  const dispatch = useAppDispatch();
  //storing the openfaas function store
  const OFReducer = useAppSelector((state: IReducers) => state.OFReducer);
  const { state } = useLocation();
  const [id] = useState(props.id || state[0]?._id);
  const [deployedFunctions, setDeployedFunctions] = useState<
    DeployedFunctionTypes[]
  >(OFReducer.deployedFunctions || []);
  const [openFaaSFunctionList, setOpenFaaSFunctions] = useState<
    FunctionTypes[]
  >([]);
  //stores all openfaas functions from the openfaas store
  const [selectedOpenFaaSFunction, setSelectedOpenFaaSFunction] =
    useState<FunctionTypes>({
      title: '',
      name: '',
      description: '',
      images: {
        arm64: '',
        armhf: '',
        x86_64: '',
      },
      repo_url: '',
    });
  //stores all deployed openfaas functions from the openfaas store
  const [selectedDeployedFunction, setSelectedDeployedFunction] =
    useState<DeployedFunctionTypes>({
      name: 'none',
      replicas: 0,
      invocationCount: 0,
      image: '',
    });
  //output of openfaas function
  const [invokedOutput, setInvokedOutput] = useState('');
  //function description pulled from openfaas store
  const [funcDescription, setFuncDescription] = useState('');
  //toggling this boolean will rerender functions (look at useeffect)
  const [renderFunctions, setRenderFunctions] = useState(false);
  //store the req body sent to invoke openfaas
  const [reqBody, setReqBody] = useState('');
  //stores the invocation count for serverless function
  const [invokeCount, setInvokeCount] = useState<number>(
    selectedDeployedFunction.invocationCount
  );

  //styling for mui components below
  const dropdownStyle = {
    background: 'white',
    borderRadius: '5px',
    padding: '0.5rem',
    marginBottom: '0px',
    width: '100%',
    fontSize: '10px',
  };
  const inputStyle = {
    width: '45%',
    '@media screen and (max-width: 820px)': {
      width: '75%',
    },
  };

  //variable to store the selected deployed function from dropdown
  const optionRef = useRef();

  //function that passes in the openfaas function name and returns the function object from the state
  const findStoreFuncFromRedux = (name: string): FunctionTypes | undefined => {
    const funcTypeObj: FunctionTypes | undefined = openFaaSFunctionList.find(
      (el) => {
        return el.name === name;
      }
    );
    return funcTypeObj;
  };

  //function that passes in the deployed function and returns function object from state
  const findFuncFromRedux = (
    name: string
  ): DeployedFunctionTypes | undefined => {
    const depTypeObj: DeployedFunctionTypes | undefined =
      deployedFunctions.find((el) => {
        return el.name === name;
      });
    return depTypeObj;
  };

  // function that passing in function and and finds the function description from openfaas function list
  const getDescription = (name: string): void => {
    const funcObj: FunctionTypes | undefined = openFaaSFunctionList.find(
      (func) => {
        return func.name === name;
      }
    );
    setFuncDescription(funcObj?.description || '');
  };

  useEffect(() => {
    //function gets all openfaas functions from openfaas store
    const openFaaSFunctions = async () => {
      try {
        const funcs = await Get(apiRoute.getRoute('faas?OpenFaaSStore=true'));
        setOpenFaaSFunctions(funcs.functions);
      } catch (error) {
        console.log('Error in fetching OpenFaaS Functions', error);
      }
    };
    openFaaSFunctions();
  }, []);

  useEffect(() => {
    //function gets all deployed functions from openfaas store
    const fetchFunctions = async () => {
      try {
        const funcs = await Get(apiRoute.getRoute(`faas`), { id });
        if (funcs.message) {
          dispatch(GET_DeployedOFFunc([]));
        } else {
          dispatch(
            GET_DeployedOFFunc(
              funcs.sort((a: { name: string }, b: { name: string }) =>
                a.name.localeCompare(b.name)
              )
            )
          );
          setDeployedFunctions(funcs);
          const funcObj = findFuncFromRedux(selectedDeployedFunction.name);
          if (funcObj) {
            setSelectedDeployedFunction(funcObj);
            setInvokeCount(funcObj.invocationCount || 0);
          }
        }
      } catch (error) {
        console.log('Error in fetching deployed OpenFaaS Functions', error);
      }
    };
    fetchFunctions();
  }, [renderFunctions]);

  //event listener that will deploy openfaas function to current cluster
  const handleDeployOpenFaaS = async () => {
    try {
      const getFunc = openFaaSFunctionList.find(
        (element) => element.name === selectedOpenFaaSFunction.name
      );
      const body = {
        clusterId: id,
        service: selectedOpenFaaSFunction.name,
        image: getFunc?.images.x86_64,
      };
      const response = await Post(apiRoute.getRoute('faas'), body);
      if (response.success) {
        setRenderFunctions(!renderFunctions);
        const funcObj: DeployedFunctionTypes | undefined = findFuncFromRedux(
          selectedOpenFaaSFunction.name
        );
        if (funcObj) {
          setSelectedDeployedFunction(funcObj);
          setFuncDescription(selectedOpenFaaSFunction.description);
          setInvokeCount(funcObj.invocationCount || 0);
        } else {
          setSelectedDeployedFunction({
            ...selectedDeployedFunction,
            name: selectedOpenFaaSFunction.name,
            invocationCount: 0,
          });
          setFuncDescription(selectedOpenFaaSFunction.description);
          setInvokeCount(0);
        }
      }
    } catch (error) {
      console.log('Error in handleDeployOpenFaaS', error);
    }
  };

  //event listener that will update state with selected openfaas function
  const handleOpenFaaSFunctionsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const funcObj: FunctionTypes | undefined = findStoreFuncFromRedux(
      e.target.value
    );
    if (funcObj) setSelectedOpenFaaSFunction(funcObj);
    else
      setSelectedOpenFaaSFunction({
        ...selectedOpenFaaSFunction,
        name: e.target.value,
      });
  };

  //event listener when update count is clicked, this will trigger useeffect to run
  const handleCount = async (): Promise<void> => {
    setRenderFunctions(!renderFunctions);
  };

  //event listener when invoke button is clicked, this will invoke selected function
  const handleInvoke = async () => {
    // setInvoked(true);
    try {
      const functionName = selectedDeployedFunction.name;
      if (functionName in customFuncBody) {
        const body = {
          clusterId: id,
          functionName: functionName,
        };
        const res = await Post(apiRoute.getRoute('faas/invoke'), body);
        setInvokedOutput(res.result);
        setRenderFunctions(!renderFunctions);
        sessionStorage.setItem('openFaasResBody', res.result);
      } else {
        const body = {
          clusterId: id,
          functionName: functionName,
          data: reqBody,
        };
        const res = await Post(apiRoute.getRoute('faas/invoke'), body);
        setRenderFunctions(!renderFunctions);
        sessionStorage.setItem('openFaasResBody', res.result);
      }
    } catch (error) {
      console.log('Error in handleInvoke', error);
    }
  };

  //event listener when delete function is clicked, this will send a delete request to remove function from current cluster
  const handleDelete = async () => {
    try {
      const body = {
        clusterId: id,
        functionName: selectedDeployedFunction.name,
      };
      const response = await Delete(apiRoute.getRoute('faas'), body, {
        authorization: localStorage.getItem('token'),
      });
      if (response.success) {
        dispatch(
          DEL_DeployedOFFunc(
            id,
            deployedFunctions.filter((el) => el.name !== body.functionName)
          )
        );
        setRenderFunctions(!renderFunctions);
        setInvokedOutput('Deployed function deleted');
        setSelectedDeployedFunction({
          name: '',
          replicas: 0,
          invocationCount: 0,
          image: '',
        });
        setFuncDescription('');
      }
    } catch (error) {
      console.log('Error in handleInvoke', error);
    }
  };

  //event listener when deployed function is selected that will update state
  const handleDeployedFunctionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const funcObj = findFuncFromRedux(e.target.value);
    if (funcObj) {
      setSelectedDeployedFunction(funcObj);
      getDescription(funcObj.name);
    }
    setRenderFunctions(!renderFunctions);
  };

  //stores request body in session storage
  const localStore = () => {
    sessionStorage.setItem(
      'openFaasReqBody',
      (document.getElementById('func-req-body') as HTMLInputElement).value
    );
  };

  //remove previous session storage on first page load
  window.onbeforeunload = function () {
    sessionStorage.clear();
  };

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          gap: '1.5rem',
          marginLeft: '-1rem',
          marginTop: '8px',
          justifyContent: 'center',
          '@media screen and (max-width: 820px)': {
            flexDirection: 'column',
            gap: '0.5rem',
            alignItems: 'center',
          },
        }}
      >
        <Box sx={inputStyle}>
          <FormControl fullWidth sx={dropdownStyle}>
            <NativeSelect
              placeholder="hi"
              onChange={handleOpenFaaSFunctionsChange}
              inputProps={{
                name: 'OpenFaaS Functions Store',
                id: 'uncontrolled-native',
              }}
            >
              {openFaaSFunctionList.map((element, idx) => {
                return (
                  <option key={idx} value={element.name}>
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
            onClick={handleDeployOpenFaaS}
            sx={{
              background: '#3a4a5b',
              borderRadius: '5px',
              marginBottom: '20px',
              width: '100%',
              fontSize: '10px',
              marginTop: '0.3rem',
            }}
          >
            Deploy from store
          </Button>
        </Box>
        <Box sx={inputStyle}>
          <FormControl fullWidth sx={dropdownStyle}>
            <NativeSelect
              placeholder="Select Function to Invoke"
              inputProps={{
                name: 'Deployed Functions',
                id: 'uncontrolled-native',
              }}
              value={selectedDeployedFunction.name}
              ref={optionRef}
              onChange={handleDeployedFunctionChange}
            >
              <option value="none">--Select Function to Invoke--</option>
              {OFReducer.deployedFunctions.map((element, idx) => {
                return (
                  <option key={idx} value={element.name}>
                    {element.name}
                  </option>
                );
              })}
            </NativeSelect>
          </FormControl>
          <Box
            sx={{
              width: '100%',
              marginTop: '0.3rem',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Button
              disabled={selectedDeployedFunction.name === ''}
              variant="contained"
              className="btn"
              type="button"
              onClick={handleInvoke}
              sx={{
                background: '#3a4a5b',
                borderRadius: '5px',
                marginBottom: '20px',
                width: '33%',
                fontSize: '10px',
              }}
            >
              Invoke
            </Button>
            <Button
              disabled={selectedDeployedFunction.name === ''}
              variant="contained"
              className="btn"
              type="button"
              onClick={handleCount}
              sx={{
                background: '#3a4a5b',
                borderRadius: '5px',
                marginBottom: '20px',
                width: '33%',
                fontSize: '10px',
                padding: '2px',
              }}
            >
              Update Count
            </Button>
            <Button
              variant="contained"
              className="btn"
              type="button"
              onClick={handleDelete}
              sx={{
                background: '#3a4a5b',
                borderRadius: '5px',
                marginBottom: '20px',
                width: '30%',
                fontSize: '10px',
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box
          sx={{
            background: '#F0F0F0',
            color: 'black',
            width: '100%',
            height: '140px',
            overflowY: 'scroll',
            borderRadius: '15px',
            textAlign: 'left',
            fontSize: '16px',
            '@media screen and (max-width: 820px)': {
              width: '80%',
            },
          }}
        >
          <Box
            sx={{
              margin: '4px',
              marginLeft: '10px',
              // height: '40px',
            }}
          >
            <h2 id="func-title">Function Information</h2>
            {selectedDeployedFunction.name && (
              <div id="func-div">
                <span>
                  {`
                Function Name: ${selectedDeployedFunction.name}
                `}
                </span>
                <span className="func-info">
                  {`Invocation Count: ${invokeCount}`}
                </span>
                <div>Description: {funcDescription}</div>
              </div>
            )}
          </Box>
        </Box>
        <TextField
          onChange={(newReqBody) => {
            setReqBody(newReqBody.target.value);
            localStore();
          }}
          type="text"
          id="func-req-body"
          label="Request Body"
          variant="filled"
          defaultValue={sessionStorage.getItem('openFaasReqBody') || ''}
          size="small"
          margin="dense"
          multiline
          rows={6}
          sx={{
            background: '#F0F0F0',
            paddingTop: '10px',
            borderRadius: '15px',
            marginRight: '3px',
            marginBottom: '0px',
            width: '100%',
            fontSize: '10px',
            '@media screen and (max-width: 820px)': {
              width: '80%',
            },
          }}
        />
        <TextField
          value={invokedOutput || sessionStorage.getItem('openFaasResBody')}
          type="text"
          label="Response Body"
          variant="filled"
          size="small"
          margin="dense"
          multiline
          rows={8}
          sx={{
            background: '#F0F0F0',
            paddingTop: '15px',
            borderRadius: '15px',
            marginRight: '3px',
            marginBottom: '20px',
            width: '100%',
            fontSize: '10px',
            '@media screen and (max-width: 820px)': {
              width: '80%',
            },
          }}
        />
      </Box>
    </Container>
  );
};;;

export default OpenFaaS;
