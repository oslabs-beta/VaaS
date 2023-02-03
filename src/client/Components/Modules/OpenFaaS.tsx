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
import { Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import './styles.css';

// need to convert to redux for selected/ deployed function
const OpenFaaS = (props: Modules) => {
  const dispatch = useAppDispatch();
  const OFReducer = useAppSelector((state: IReducers) => state.OFReducer);
  const { state }: any = useLocation();
  const [id] = useState(props.id || state[0]?._id);
  const deployedFunctions = OFReducer.deployedFunctions || [];
  const [openFaaSFunctions, setOpenFaaSFunctions] = useState<FunctionTypes[]>(
    []
  );
  // we might need to turn these into global state

  const [selectedOpenFaaSFunction, setSelectedOpenFaaSFunction] = useState('');
  const [selectedDeployedFunction, setSelectedDeployedFunction] = useState('');
  const [invokedOutput, setInvokedOutput] = useState('');
  const [renderFunctions, setRenderFunctions] = useState(false);
  const [reqBody, setRegBody] = useState('');
  // const [invoked, setInvoked] = useState(false);
  const [invokeCount, setInvokeCount] = useState(0);
  const [dropdownStyle] = useState({
    background: 'white',
    borderRadius: '5px',
    padding: '0.5rem',
    marginBottom: '0px',
    width: '100%',
    fontSize: '10px',
  });
  const [inputStyle] = useState({
    width: '45%',
    '@media screen and (max-width: 820px)': {
      width: '75%',
    },
  });

  const [textAreaRows, setTextAreaRows] = useState(4);
  const [textAreaStyle, setTextAreaStyle] = useState({
    color: '#F0F0F0',
    height: '140px',
  });

  const optionRef = useRef();

  const fetchFunctions = async () => {
    console.log(id);
    try {
      console.log('id is', id);
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
      }
    } catch (error) {
      console.log('Error in fetching deployed OpenFaaS Functions', error);
    }
  };

  useEffect(() => {
    if (!props.nested) {
      setTextAreaStyle({
        ...textAreaStyle,
        color: '#F0F0F0',
        height: '42.5vw',
      });
      setTextAreaRows(8);
    }
    const openFaaSFunctions = async () => {
      try {
        const funcs = await Get(apiRoute.getRoute('faas?OpenFaaSStore=true'));
        setOpenFaaSFunctions(funcs.functions);
      } catch (error) {
        console.log('Error in fetching OpenFaaS Functions', error);
      }
    };

    openFaaSFunctions();
    fetchFunctions();
  }, [renderFunctions, invokeCount]);

  const handleDeployOpenFaaS = async () => {
    try {
      const getFunc = openFaaSFunctions.find(
        (element) => element.name === selectedOpenFaaSFunction
      );
      console.log(
        'THIS IS BEFORE POST REQ',
        id,
        selectedOpenFaaSFunction,
        getFunc
      );
      const body = {
        clusterId: id,
        service: selectedOpenFaaSFunction,
        image: getFunc?.images.x86_64,
      };
      const response = await Post(apiRoute.getRoute('faas'), body);
      if (response.success) {
        setRenderFunctions(!renderFunctions);
        setSelectedDeployedFunction(selectedOpenFaaSFunction);
      }
    } catch (error) {
      console.log('Error in handleDeployOpenFaaS', error);
    }
  };

  const handleOpenFaaSFunctionsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOpenFaaSFunction(e.target.value);
  };

  const handleInvoke = async () => {
    // setInvoked(true);
    try {
      const functionName = selectedDeployedFunction;
      if (functionName in customFuncBody) {
        const body = {
          clusterId: id,
          functionName: functionName,
        };
        const res = await Post(apiRoute.getRoute('faas/invoke'), body);
        setInvokedOutput(res.result);
        sessionStorage.setItem('openFaasResBody', res.result);
        setInvokeCount(res.count);
        // setInvoked(false);
      } else {
        console.log('requestBody', reqBody);
        const body = {
          clusterId: id,
          functionName: functionName,
          data: reqBody,
        };
        const res = await Post(apiRoute.getRoute('faas/invoke'), body);
        setInvokedOutput(res.result);
        res.count !== undefined ? setInvokeCount(res.count) : setInvokeCount(0);
        sessionStorage.setItem('openFaasResBody', res.result);
      }
    } catch (error) {
      console.log('Error in handleInvoke', error);
    }
  };

  const handleDelete = async () => {
    try {
      setSelectedDeployedFunction('');
      const body = {
        clusterId: id,
        functionName: selectedDeployedFunction,
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

        setInvokedOutput('Deployed function deleted');
      }
    } catch (error) {
      console.log('Error in handleInvoke', error);
    }
  };

  const findFuncFromRedux = (name: string) => {
    const funcObj = deployedFunctions.find((el) => el.name === name);
    return funcObj;
  };

  const handleDeployedFunctionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeployedFunction(e.target.value);
    const funcObj = findFuncFromRedux(e.target.value);
    if (typeof funcObj === 'object' && funcObj.invocationCount !== undefined) {
      setInvokeCount(funcObj.invocationCount);
    } else {
      setInvokeCount(0);
    }
  };

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
              {openFaaSFunctions.map((element, idx) => {
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
            sx={
              props.isDark
                ? {
                    background: '#c0c0c0',
                    color: '#1f2022',
                    borderRadius: '5px',
                    marginBottom: '20px',
                    width: '100%',
                    fontSize: '10px',
                    // marginLeft: '0.5rem',
                  }
                : {
                    background: '#3a4a5b',
                    borderRadius: '5px',
                    marginBottom: '20px',
                    width: '100%',
                    fontSize: '10px',
                    // marginLeft: '0.5rem',
                  }
            }
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
              value={selectedDeployedFunction}
              ref={optionRef}
              onChange={handleDeployedFunctionChange}
            >
              <option value="" selected>
                --Select Function to Invoke--
              </option>
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
              // marginLeft: '0.6rem',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Button
              disabled={selectedDeployedFunction === ''}
              variant="contained"
              className="btn"
              type="button"
              onClick={handleInvoke}
              sx={
                props.isDark
                  ? {
                      background: '#c0c0c0',
                      color: '#1f2022',
                      borderRadius: '5px',
                      marginBottom: '20px',
                      width: '32%',
                      fontSize: '10px',
                    }
                  : {
                      background: '#3a4a5b',
                      borderRadius: '5px',
                      marginBottom: '20px',
                      width: '32%',
                      fontSize: '10px',
                    }
              }
            >
              Invoke
            </Button>
            <Button
              disabled={selectedDeployedFunction === ''}
              variant="contained"
              className="btn"
              type="button"
              // onClick={handleInvoke}
              sx={{
                background: '#3a4a5b',
                borderRadius: '5px',
                marginBottom: '20px',
                width: '32%',
                fontSize: '10px',
              }}
            >
              Update Count
            </Button>
            <Button
              variant="contained"
              className="btn"
              type="button"
              onClick={handleDelete}
              sx={
                props.isDark
                  ? {
                      background: '#c0c0c0',
                      color: '#1f2022',
                      borderRadius: '5px',
                      marginBottom: '20px',
                      width: '30%',
                      fontSize: '10px',
                    }
                  : {
                      background: '#3a4a5b',
                      borderRadius: '5px',
                      marginBottom: '20px',
                      width: '30%',
                      fontSize: '10px',
                    }
              }
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
            background: textAreaStyle.color,
            color: 'black',
            width: '100%',
            height: '70px',
            overflow: 'scroll',
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
              height: '40px',
            }}
          >
            <b>Function Information</b>
            {selectedDeployedFunction && (
              <div id="func-div">
                <span>
                  {`
                Function Name: ${selectedDeployedFunction}
                `}
                </span>
                <span className="func-info">
                  {
                    `Invocation count: ${invokeCount}`
                    // `Invocation count: ${
                    //   findFuncFromRedux(selectedDeployedFunction)
                    //     ?.invocationCount || 0}`
                  }
                </span>
              </div>
            )}
          </Box>
        </Box>
        <TextField
          onChange={(newReqBody) => {
            setRegBody(newReqBody.target.value);
            localStore();
          }}
          type="text"
          id="func-req-body"
          label="Request Body"
          variant="filled"
          defaultValue={sessionStorage.getItem('openFaasReqBody')}
          size="small"
          margin="dense"
          multiline
          rows={textAreaRows}
          sx={{
            background: textAreaStyle.color,
            paddingTop: '10px',
            borderRadius: '5px',
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
          rows={textAreaRows}
          sx={{
            background: textAreaStyle.color,
            paddingTop: '15px',
            borderRadius: '5px',
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
};

export default OpenFaaS;
