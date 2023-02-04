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

// need to convert to redux for selected/ deployed function
const OpenFaaS = (props: Modules) => {
  const dispatch = useAppDispatch();
  const OFReducer = useAppSelector((state: IReducers) => state.OFReducer);
  const { state } = useLocation();
  const [id] = useState(props.id || state[0]?._id);
  // const [deployedFunctions] = OFReducer.deployedFunctions || [];
  const [deployedFunctions, setDeployedFunctions] = useState<
    DeployedFunctionTypes[]
  >([]);
  const [openFaaSFunctionList, setOpenFaaSFunctions] = useState<
    FunctionTypes[]
  >([]);
  // we might need to turn these into global state

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
  // const [selectedDeployedFunction, setSelectedDeployedFunction] = useState('');
  const [selectedDeployedFunction, setSelectedDeployedFunction] =
    useState<DeployedFunctionTypes>({
      name: '',
      replicas: 0,
      invocationCount: 0,
      image: '',
    });
  const [invokedOutput, setInvokedOutput] = useState('');
  const [funcDescription, setFuncDescription] = useState('');
  const [renderFunctions, setRenderFunctions] = useState(false);
  const [reqBody, setRegBody] = useState('');
  // const [invoked, setInvoked] = useState(false);
  const [invokeCount, setInvokeCount] = useState<number>(
    selectedDeployedFunction.invocationCount
  );
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

  const findFuncFromRedux = (
    name: string,
    store?: boolean
  ): FunctionTypes | DeployedFunctionTypes | undefined => {
    //console.log('name in findfunc', name);
    if (store) {
      const funcTypeObj: FunctionTypes | undefined = openFaaSFunctionList.find(
        (el) => {
          //console.log('el.name: ', el.name, el.name === name);
          return el.name === name;
        }
      );
      return funcTypeObj;
    }
    const depTypeObj: DeployedFunctionTypes | undefined =
      deployedFunctions.find((el) => {
        //console.log('el.name: ', el.name, el.name === name);
        return el.name === name;
      });
    return depTypeObj;
  };

  const getDescription = (name: string): void => {
    const funcObj: FunctionTypes | undefined = openFaaSFunctionList.find(
      (func) => {
        return func.name === name;
      }
    );
    setFuncDescription(funcObj?.description || '');
  };

  const fetchFunctions = async () => {
    // //console.log(id);
    try {
      // //console.log('id is', id);
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
      //console.log('func in fetchfunctions', funcs);
    } catch (error) {
      //console.log('Error in fetching deployed OpenFaaS Functions', error);
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
        //console.log('Error in fetching OpenFaaS Functions', error);
      }
    };
    openFaaSFunctions();
    fetchFunctions();
    setDeployedFunctions(OFReducer.deployedFunctions);
  }, [renderFunctions, invokeCount]);

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
        await fetchFunctions();
        setDeployedFunctions(OFReducer.deployedFunctions);
        const funcObj: DeployedFunctionTypes | undefined = findFuncFromRedux(
          selectedOpenFaaSFunction.name
        );
        //console.log(
          'funcobj in dandly: ',
          funcObj,
          selectedOpenFaaSFunction.name
        );
        if (funcObj) {
          //console.log('you did it!!');
          setSelectedDeployedFunction(funcObj);
          setInvokeCount(funcObj.invocationCount);
          setFuncDescription(selectedOpenFaaSFunction.description);
        } else {
          setSelectedDeployedFunction({
            ...selectedDeployedFunction,
            name: selectedOpenFaaSFunction.name,
          });
          setInvokeCount(0);
          setFuncDescription(selectedOpenFaaSFunction.description);
          //console.log('you loser: ', deployedFunctions);
        }
      }
    } catch (error) {
      //console.log('Error in handleDeployOpenFaaS', error);
    }
  };

  const handleOpenFaaSFunctionsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const funcObj: FunctionTypes | undefined = findFuncFromRedux(
      e.target.value,
      true
    );
    if (funcObj) setSelectedOpenFaaSFunction(funcObj);
    else
      setSelectedOpenFaaSFunction({
        ...selectedOpenFaaSFunction,
        name: e.target.value,
      });
  };

  const handleCount = async (): Promise<void> => {
    await fetchFunctions();
    setDeployedFunctions(OFReducer.deployedFunctions);
    // //console.log(selectedDeployedFunction, 'inside handle count');
    const funcObj: DeployedFunctionTypes | undefined = findFuncFromRedux(
      selectedDeployedFunction.name
    );
    //console.log('funcObj in handlecount: ', funcObj);
    if (funcObj) setSelectedDeployedFunction(funcObj);
    //console.log(funcObj?.invocationCount, 'handlecount count');
    setInvokeCount(funcObj?.invocationCount || 0);
  };

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
        sessionStorage.setItem('openFaasResBody', res.result);
        await fetchFunctions();
        setDeployedFunctions(OFReducer.deployedFunctions);
        setInvokeCount(res.count);
        //console.log(deployedFunctions, 'depfunc in handleinvoke');
        // setInvoked(false);
      } else {
        //console.log('requestBody', reqBody);
        const body = {
          clusterId: id,
          functionName: functionName,
          data: reqBody,
        };
        const res = await Post(apiRoute.getRoute('faas/invoke'), body);
        setInvokedOutput(res.result);
        setInvokeCount(res.count);
        await fetchFunctions();
        setDeployedFunctions(OFReducer.deployedFunctions);
        //console.log(deployedFunctions, 'depfunc in handleinvoke in else');
        res.count !== undefined ? setInvokeCount(res.count) : setInvokeCount(0);
        sessionStorage.setItem('openFaasResBody', res.result);
      }
    } catch (error) {
      //console.log('Error in handleInvoke', error);
    }
  };

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
        await fetchFunctions();
        setDeployedFunctions(OFReducer.deployedFunctions);
        //console.log(deployedFunctions, 'in delete');
        setInvokedOutput('Deployed function deleted');
        setSelectedDeployedFunction({
          name: '',
          replicas: 0,
          invocationCount: 0,
          image: '',
        });
      }
    } catch (error) {
      //console.log('Error in handleInvoke', error);
    }
  };

  const handleDeployedFunctionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const funcObj = findFuncFromRedux(e.target.value);
    if (funcObj) setSelectedDeployedFunction(funcObj);
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
            sx={
              // props.isDark
              //   ? {
              //       background: '#c0c0c0',
              //       color: '#1f2022',
              //       borderRadius: '5px',
              //       marginBottom: '20px',
              //       width: '100%',
              //       fontSize: '10px',
              //       // marginLeft: '0.5rem',
              //       marginTop: '0.3rem',
              //     } :
              {
                background: '#3a4a5b',
                borderRadius: '5px',
                marginBottom: '20px',
                width: '100%',
                fontSize: '10px',
                marginTop: '0.3rem',
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
              value={selectedDeployedFunction.name}
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
              sx={
                // props.isDark
                //   ? {
                //       background: '#c0c0c0',
                //       color: '#1f2022',
                //       borderRadius: '5px',
                //       marginBottom: '20px',
                //       width: '32%',
                //       fontSize: '10px',
                //     } :
                {
                  background: '#3a4a5b',
                  borderRadius: '5px',
                  marginBottom: '20px',
                  width: '33%',
                  fontSize: '10px',
                }
              }
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
              sx={
                props.isDark
                  ? {
                      background: '#c0c0c0',
                      color: '#1f2022',
                      borderRadius: '5px',
                      marginBottom: '20px',
                      width: '33%',
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
            height: '100px',
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
            {selectedDeployedFunction.name && (
              <div id="func-div">
                <span>
                  {`
                Function Name: ${selectedDeployedFunction.name}
                `}
                </span>
                <span className="func-info">
                  {`Invocation count: ${invokeCount}`}
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
          rows={textAreaRows}
          sx={{
            background: textAreaStyle.color,
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
};

export default OpenFaaS;
