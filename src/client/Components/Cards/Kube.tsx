import React, { useEffect, useState } from 'react';
import { ClusterTypes, useFetchMetricsProps } from '../../Interfaces/ICluster';
import { Put } from '../../Services';
import { apiRoute } from '../../utils';
import Module from './Module';
import ClusterSettings from '../Modules/ClusterSettings';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { setFavRender, setUI } from '../../Store/actions';
import { IReducers } from '../../Interfaces/IReducers';
import Container from '@mui/system/Container';
import Button from '@mui/material/Button';
import InsightsIcon from '@mui/icons-material/Insights';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import FunctionsIcon from '@mui/icons-material/Functions';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsIcon from '@mui/icons-material/Settings';
import GaugeChart from 'react-gauge-chart';
import './styles.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alertClasses,
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFetchMetrics } from '../../Queries';

const Kube = (props: ClusterTypes) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const clusterReducer = useAppSelector(
    (state: IReducers) => state.clusterReducer
  );
  const apiReducer = useAppSelector((state: IReducers) => state.apiReducer);
  const uiReducer = useAppSelector((state: IReducers) => state.uiReducer);
  // need to convert below to redux?
  const [module, setModule] = useState(true);
  const [settings, setSettings] = useState(false);

  const drawerWidth = 240;
  // accessing redux state clusterDbData to find data of the specfic cluster by _id
  const [dbData] = useState(
    apiReducer.clusterDbData.find((element) => element._id === props._id)
  );
  console.log('THIS IS dbData', dbData);
  // console logging clusterQueryData in store to be sure cluster metrics was dispatched after all metrics were fetched
  // console.log(
  //   apiReducer.clusterQueryData,
  //   'apiReducer.clusterQueryDataapiReducer.clusterQueryDataapiReducer.clusterQueryDataapiReducer.clusterQueryData'
  // );

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

  const handleFavorite = async () => {
    try {
      const body = {
        clusterId: props._id,
        favorite: !props.favoriteStatus,
      };
      await Put(apiRoute.getRoute('cluster'), body, {
        authorization: localStorage.getItem('token'),
      });
      dispatch(setFavRender(!clusterReducer.favRender));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSettings = async () => {
    try {
      console.log(uiReducer);
      setModule(!module);
      setSettings(!settings);
    } catch (err) {
      console.log(err);
    }
  };

  const icons = [
    AddAlertIcon,
    InsightsIcon,
    ViewInArIcon,
    QueryStatsIcon,
    FunctionsIcon,
    AttachMoneyIcon,
    SettingsIcon,
  ];
  // const drawerMobile = (
  //   <Container className="Drawer-Container">
  //     <Toolbar />
  //     <Divider />
  //     <List>
  //       {['Alerts', 'Charts', 'Cluster Map', 'Queries', 'OpenFaaS', 'Cost'].map(
  //         (text, index) => (
  //           <ListItem key={text} disablePadding>
  //             <ListItemButton>
  //               <ListItemIcon></ListItemIcon>
  //               <ListItemText primary={text} />
  //             </ListItemButton>
  //           </ListItem>
  //         )
  //       )}
  //     </List>
  //     <Divider />
  //     <List>
  //       <ListItem key="UpdateCluster" disablePadding>
  //         <ListItemButton onClick={handleSettings}>
  //           <ListItemIcon>{/* place icon here */}</ListItemIcon>
  //           <ListItemText primary="Update Cluster" />
  //         </ListItemButton>
  //       </ListItem>
  //     </List>
  //   </Container>
  // );

  // const drawer =

  // const container = document.querySelector('#Kube-container');

  return (
    <Box
      className="Cluster-Kube-Box"
      sx={{
        display: 'flex',
        backgroundColor: '#181A1D',
        color: 'white',
        width: '80%',
        height: '380px',
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
            startIcon={<InsightsIcon />}
            onClick={() =>
              navigate('/module', { state: [dbData?._id, 'charts', true] })
            }
          >
            Graphs
          </Button>
          <Button
            className="Cluster-Buttons"
            id="Cluster-Map-Button"
            fullWidth={true}
            startIcon={<ViewInArIcon />}
            onClick={() =>
              navigate('/module', { state: [dbData?._id, 'visualizer', true] })
            }
          >
            Cluster Map
          </Button>
          <Button
            className="Cluster-Buttons"
            id="Queries-Button"
            fullWidth={true}
            startIcon={<QueryStatsIcon />}
            onClick={() =>
              navigate('/module', { state: [dbData?._id, 'custom', true] })
            }
          >
            Queries
          </Button>
          <Button
            className="Cluster-Buttons"
            id="Alerts-Button"
            fullWidth={true}
            startIcon={<AddAlertIcon />}
            onClick={() =>
              navigate('/module', { state: [dbData?._id, 'alert', true] })
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
            startIcon={<FunctionsIcon />}
            onClick={() =>
              navigate('/module', { state: [dbData?._id, 'faas', true] })
            }
          >
            OpenFaaS
          </Button>
          <Button
            className="Cluster-Buttons"
            id="FaaSCost-Button"
            fullWidth={true}
            startIcon={<AttachMoneyIcon />}
            onClick={() =>
              navigate('/module', {
                state: [dbData?._id, 'functionCost', true],
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
            paddingLeft: '10px',
            paddingRight: '10px',
            alignItems: 'center',
          }}
        >
          {dbData?.description}
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
    </Box>
  );
};

//         <span className="set-favorite noselect" onClick={handleFavorite}>
//           ❤️
//         </span>
//       )}
//       {!props.favoriteStatus && (
//         <span className="set-favorite noselect" onClick={handleFavorite}>
//           🤍
//         </span>
//       )}

//
//       <Container
//         id="gauges-container"
//         sx={{ display: 'flex', justifyContent: 'center' }}
//       >
//         <div
//           className="ov-box"
//           style={
//             props.isDark
//               ? {
//                   backgroundColor: '#34363b',
//                   color: '#c0c0c0',
//                 }
//               : {
//                   backgroundColor: '#fafafa',
//                 }
//           }
//         >
//           <div className="ov-title noselect">
//             <h3>CPU Usage</h3>
//           </div>
//           <div className="ov-content">
//             <GaugeChart
//               nrOfLevels={30}
//               colors={['green', '#FF5F6D']}
//               arcWidth={0.1}
//               percent={
//                 (apiReducer.clusterQueryData[props._id]?.cpuLoad || 0) / 100
//               }
//               style={{
//                 width: '90px',
//                 height: '2px',
//               }}
//               needleColor={props.isDark ? '#c0c0c0' : '#464A4F'}
//             />
//           </div>
//         </div>
//         <div
//           className="ov-box"
//           style={
//             props.isDark
//               ? {
//                   backgroundColor: '#34363b',
//                   color: '#c0c0c0',
//                 }
//               : {
//                   backgroundColor: '#fafafa',
//                 }
//           }
//         >
//           <div className="ov-title noselect">
//             <h3>Memory Usage</h3>
//           </div>
//           <div className="ov-content">
//             <GaugeChart
//               nrOfLevels={30}
//               colors={['green', '#FF5F6D']}
//               arcWidth={0.1}
//               percent={
//                 (apiReducer.clusterQueryData[props._id]?.memoryLoad || 0) /
//                 2048
//               }
//               style={{
//                 width: '90px',
//                 height: '2px',
//               }}
//               needleColor={props.isDark ? '#c0c0c0' : '#464A4F'}
//             />
//           </div>
//           <div className="ov-metric">
//             <p>
//               {(apiReducer.clusterQueryData[props._id]?.memoryLoad || 0) +
//                 ' /2048 MB'}
//             </p>
//           </div>
//         </div>
//       </Container>
//     </div>
//   </Container>
//   <div id="module">
//     {/* {module && (
//       <Module id={dbData?._id} nested={true} isDark={props.isDark} />
//     )} */}
//     {settings && <ClusterSettings id={dbData?._id} />}
//   </div>
// </Container>

export default Kube;
