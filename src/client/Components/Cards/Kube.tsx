import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GaugeChart from 'react-gauge-chart';
import {
  ClusterTypes,
  useFetchMetricsProps,
  IReducers,
} from '../../Interfaces';
import ClusterSettings from '../Modules/ClusterSettings';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { setUI } from '../../Store/actions';
import { useFetchMetrics } from '../../Queries';
import { Custom, Visualizer } from '../Modules';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';

import Insights from '@mui/icons-material/Insights';
import AddAlert from '@mui/icons-material/AddAlert';
import ViewInAr from '@mui/icons-material/ViewInAr';
import QueryStats from '@mui/icons-material/QueryStats';
import Functions from '@mui/icons-material/Functions';
import AttachMoney from '@mui/icons-material/AttachMoney';

import './CardsStyles.css';

// Dashboard for each cluster which is rendered onto the home page
const Kube = (props: ClusterTypes) => {
  const [settingsModal, handleSettingsModal] = useState(false);
  const [currModal, setCurrModal] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const apiReducer = useAppSelector((state: IReducers) => state.apiReducer);

  // accessing redux state clusterDbData to find data of the specfic cluster by _id
  const dbData = apiReducer.clusterDbData.find(
    (element) => element._id === props._id
  );

  // declare useFetchMetrics custom hook props
  const fetchProps: useFetchMetricsProps = {
    clusterId: props?._id,
    k8Str: 'k8',
  };

  // invoke custom hook which takes the clusterId and 'k8 as arguments/props
  const {
    allNodes,
    cpuLoad,
    memoryLoad,
    totalDeployments,
    totalPods,
    allNamespaces,
    allServices,
  } = useFetchMetrics(fetchProps);
  const customBox = {
    overflow: 'scroll',
    maxHeight: '100%',
    display: 'inline',
  };
  useEffect(() => {
    dispatch(
      setUI(props._id, {
        currentModule: 'OpenFaaS',
        fullscreen: false,
        modules: {
          OpenFaaS: {
            deployDropdown: '',
            invokeDropdown: '',
            requestBody: '',
            responseBody: '',
          },
          query: {
            inputField: '',
            responseObject: '',
          },
        },
      })
    );
  }, []);

  return (
    <Box
      className="Cluster-Kube-Box"
      sx={{
        display: 'flex',
        backgroundColor: '#181A1D',
        color: 'white',
        // width: '50%',
        width: '500px',
        minHeight: '325px',
        height: '350px',
        // maxHeight: '450px',
        border: '2px solid #15161d',
        borderRadius: '10px',
        boxShadow: '1px 1px 10px .5px rgba(248, 245, 245, 0.5)',
      }}
    >
      <CssBaseline />
      <Box
        className="Cluster-Kube-Box-Left"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          margin: '0',
          padding: '0',
          minWidth: '167px',
          borderRight: '2px solid #15161d',
        }}
      >
        <Box
          className="Cluster-Kube-Box-Title"
          onClick={() =>
            navigate('/module', {
              state: [dbData, 'charts', true],
            })
          }
          sx={{
            borderBottom: '2px solid #15161d',
            minHeight: '60px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: '15px',
            paddingRight: '10px',
          }}
        >
          {dbData?.name}
        </Box>
        <Box
          className="Cluster-Kube-Box-Modules-General"
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignContent: 'flex-end',
            gap: '5px',
            padding: '0px',
            paddingLeft: '10px',
            paddingTop: '10px',
          }}
        >
          <Button
            className="Cluster-Buttons"
            id="Graphs-Button"
            fullWidth={true}
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              pr: '0px',
              color: 'white',
            }}
            startIcon={<Insights />}
            onClick={() =>
              navigate('/module', {
                state: [dbData, 'charts', true],
              })
            }
          >
            Graphs
          </Button>
          <Button
            className="Cluster-Buttons"
            id="Cluster-Map-Button"
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              pr: '0px',
              color: 'white',
            }}
            fullWidth={true}
            startIcon={<ViewInAr />}
            onClick={() => {
              setCurrModal('visualizer');
              setOpenModal(true);
            }}
          >
            Cluster Map
          </Button>
          <Button
            className="Cluster-Buttons"
            id="Queries-Button"
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              pr: '0px',
              color: 'white',
            }}
            fullWidth={true}
            startIcon={<QueryStats />}
            onClick={() => {
              setCurrModal('custom');
              setOpenModal(true);
            }}
          >
            Queries
          </Button>
          <Button
            className="Cluster-Buttons"
            id="Alerts-Button"
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              pr: '0px',
              color: 'white',
            }}
            fullWidth={true}
            startIcon={<AddAlert />}
            onClick={() =>
              navigate('/module', { state: [dbData, 'alert', true] })
            }
          >
            Alerts
          </Button>
        </Box>
        <Divider sx={{ pt: '10px' }} />
        <Box
          className="Cluster-Kube-Box-Modules-Faas"
          sx={{
            height: '75px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0px',
            gap: '5px',
            paddingLeft: '10px',
          }}
        >
          <Button
            className="Cluster-Buttons"
            id="OpenFaaS-Button"
            fullWidth={true}
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              color: 'white',
            }}
            startIcon={<Functions />}
            onClick={() =>
              navigate('/module', { state: [dbData, 'faas', true] })
            }
          >
            OpenFaaS
          </Button>
          <Button
            className="Cluster-Buttons"
            id="FaaSCost-Button"
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              color: 'white',
            }}
            fullWidth={true}
            startIcon={<AttachMoney />}
            onClick={() =>
              navigate('/module', {
                state: [dbData, 'functionCost', true],
              })
            }
          >
            FaaS Cost
          </Button>
          <Button
            className="Cluster-Buttons"
            id="FaaSCost-Button"
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              color: 'white',
            }}
            fullWidth={true}
            startIcon={<AttachMoney />}
            onClick={() =>
              navigate('/module', {
                state: [dbData, 'kubacus', true],
              })
            }
          >
            Kubacus
          </Button>
        </Box>
      </Box>
      <Box
        className="Cluster-Kube-Box-Right"
        sx={{
          width: '100%',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          margin: '0',
        }}
      >
        <Box
          className="Cluster-Description-Box"
          sx={{
            borderBottom: '2px solid #15161d',
            height: '60px',
            minHeight: '60px',
            maxHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="Cluster-Information">
            <div
              className="cluster-description"
              onClick={() =>
                navigate('/module', {
                  state: [dbData, 'charts', true],
                })
              }
            >
              {dbData?.description}
            </div>
            <Tooltip title="Cluster Settings">
              <div
                id="settingButton"
                onClick={() => {
                  handleSettingsModal(true);
                }}
              >
                {' '}
                &#9784;
              </div>
            </Tooltip>
          </div>
        </Box>
        <Box
          className="Basic-Descriptors"
          onClick={() =>
            navigate('/module', {
              state: [dbData, 'charts', true],
            })
          }
        >
          <Box
            className="Cluster-Nodes-Box"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div className="basic-descriptor-title" id="node-title">
              NODES:{' '}
            </div>
            <div>{allNodes?.length || 0}</div>
          </Box>
          <Box
            className="Cluster-Deployments-Box"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div className="basic-descriptor-title" id="deployment-title">
              DEPLOYMENTS:{' '}
            </div>
            <div>{totalDeployments || 0}</div>
          </Box>
          <Box
            className="Cluster-Pods-Box"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div className="basic-descriptor-title" id="pod-title">
              PODS:{' '}
            </div>
            <div>{totalPods || 0}</div>
          </Box>
        </Box>
        <Box
          className="Gauges-Descriptors"
          onClick={() =>
            navigate('/module', {
              state: [dbData, 'charts', true],
            })
          }
        >
          <Box
            className="Cluster-CPU-Box"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Box className="Cluster-CPU-Box-Title">CPU</Box>
            <Box className="Cluster-CPU-Gauge">
              <GaugeChart
                nrOfLevels={30}
                colors={['green', '#FF5F6D']}
                arcWidth={0.1}
                percent={(Number(cpuLoad) || 0) / 100}
                style={{
                  width: '90px',
                  height: '2px',
                }}
                needleColor={props.isDark ? '#c0c0c0' : '#464A4F'}
                hideText={true}
              />
              <a className="gauge-text">{cpuLoad || 0}%</a>
            </Box>
          </Box>
          <Box
            className="Cluster-Memory-Box"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Box className="Cluster-Memory-Box-Title">Memory</Box>
            <Box className="Cluster-Memory-Gauge">
              <GaugeChart
                nrOfLevels={30}
                colors={['green', '#FF5F6D']}
                arcWidth={0.1}
                percent={(memoryLoad || 0) / 2048}
                style={{
                  width: '90px',
                  height: '2px',
                }}
                needleColor={props.isDark ? '#c0c0c0' : '#464A4F'}
                hideText={true}
              />
              <a className="gauge-text">{memoryLoad || 0} / 2048 MB</a>
            </Box>
          </Box>
        </Box>
      </Box>
      <Modal
        open={settingsModal}
        onClose={() => {
          handleSettingsModal(false);
        }}
        sx={{ border: 'none' }}
      >
        <Box className="Settings-Modal-Container" sx={{ border: 'none' }}>
          <ClusterSettings
            refetch={props?.refetch}
            id={dbData?._id}
            name={dbData?.name}
            handleModal={handleSettingsModal}
          />
        </Box>
      </Modal>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <>
          {currModal === 'custom' ? (
            <Custom
              handleCustomClose={handleCloseModal}
              customBox={customBox}
              dbData={dbData}
            />
          ) : (
            <Visualizer
              handleVisualizerClose={handleCloseModal}
              customBox={customBox}
              dbData={dbData}
            />
          )}
        </>
      </Modal>
    </Box>
  );
};

export default Kube;
