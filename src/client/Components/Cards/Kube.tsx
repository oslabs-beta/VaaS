import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GaugeChart from 'react-gauge-chart';
import { ClusterTypes, useFetchMetricsProps } from '../../Interfaces';
import { IReducers } from '../../Interfaces/IReducers';
import ClusterSettings from '../Modules/ClusterSettings';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { setUI } from '../../Store/actions';
import { useFetchMetrics } from '../../Queries';
import { Button, Tooltip, Modal, Box, CssBaseline, Divider } from '@mui/material';
import { Insights, AddAlert, ViewInAr, QueryStats, Functions, AttachMoney, Settings } from '@mui/icons-material';
import './styles.css';

// Dashboard for each cluster which is rendered onto the home page
const Kube = (props: ClusterTypes) => {
  const [settingsModal, handleSettingsModal] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const apiReducer = useAppSelector((state: IReducers) => state.apiReducer);

  // accessing redux state clusterDbData to find data of the specfic cluster by _id
  const dbData = apiReducer.clusterDbData.find((element) => element._id === props._id);
  
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
        width: '60%',
        minWidth: '500px',
        maxWidth: '1500px',
        minHeight: '350px',
        height: '30vh',
        maxHeight: '450px',
        border: '2px solid #15161d',
        boxShadow: '1px 1px 10px .5px #403e54',
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
          minWidth: '150px',
          borderRight: '2px solid #15161d',
        }}
      >
        <Box
          className="Cluster-Kube-Box-Title"
          sx={{
            borderBottom: '2px solid #15161d',
            minHeight: '60px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
            alignItems: 'flex-start',
            gap: '10px',
            paddingTop: '10px',
            paddingBottom: '10px',
          }}
        >
          <Button
            className="Cluster-Buttons"
            id="Graphs-Button"
            fullWidth={true}
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
            fullWidth={true}
            startIcon={<ViewInAr />}
            onClick={() =>
              navigate('/module', {
                state: [dbData, 'visualizer', true],
              })
            }
          >
            Cluster Map
          </Button>
          <Button
            className="Cluster-Buttons"
            id="Queries-Button"
            fullWidth={true}
            startIcon={<QueryStats />}
            onClick={() =>
              navigate('/module', { state: [dbData, 'custom', true] })
            }
          >
            Queries
          </Button>
          <Button
            className="Cluster-Buttons"
            id="Alerts-Button"
            fullWidth={true}
            startIcon={<AddAlert />}
            onClick={() =>
              navigate('/module', { state: [dbData, 'alert', true] })
            }
          >
            Alerts
          </Button>
        </Box>
        <Divider />
        <Box
          className="Cluster-Kube-Box-Modules-Faas"
          sx={{
            height: '200px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <Button
            className="Cluster-Buttons"
            id="OpenFaaS-Button"
            fullWidth={true}
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
        </Box>
      </Box>
      <Box
        className="Cluster-Kube-Box-Right"
        sx={{
          width: '100%',
          height: '100%',
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
          }}
        >
          <div className="Cluster-Information">
            {dbData?.description}
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
        <Box className="Basic-Descriptors">
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
        <Box className="Gauges-Descriptors">
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
                percent={(cpuLoad || 0) / 100}
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
          <Button
            id="closeButton"
            onClick={() => {
              handleSettingsModal(false);
            }}
          >
            {'Close Settings'}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Kube;
