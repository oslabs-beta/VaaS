import React, { useEffect, useState } from 'react';
import { Modules } from '../../Interfaces/ICluster';
import { clusterMetric, podMetric } from '../../Queries';
import Box  from '@mui/material/Box';
import Appbar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


const Visualizer = (props: Modules) => {
  // we would need to pull this information from cluster
  //fetch request to 'http://localhost:3000X/api/v1/query?query=kube_namespace_created'
  //'http://localhost:30000/api/v1/query?query=kube_service_created'
  //http://localhost:30000/api/v1/query?query=kube_deployment_created
  //http://localhost:30000/api/v1/query?query=kube_service_created

  //clusterMetric.allNamespaces
  //clusterMetric.allServices
  //clusterMetric.allNodes
  //clusterMetric.totalDeployments

  const [ nameSpaces, setNameSpaces ] = useState ('');
  const [ services, setServices ] = useState ('');
  const [ nodes, setNodes ] = useState ('');
  const [ deployments, setDeployments ] = useState ('');

  useEffect(() => {
    const fetchNamespaces = async () => {
      const nodes = await clusterMetric.allNamespaces(props._id, 'k8');
      setNodeName(nodes);
    };
    fetchNodes();
    const fetchCpuUsage = async () => {
      const cpuUsage = await nodeMetric.cpuLoad(props._id, 'k8');
      setCpuUsage(cpuUsage);
    };
    fetchCpuUsage();
    const fetchMemoryUsage = async () => {
      const memoryUsage = await clusterMetric.memoryLoad(props._id, 'k8');
      setMemoryUsage(memoryUsage);
    };
    fetchMemoryUsage();
    const fetchTotalDeployments = async () => {
      const totalDeployments = await clusterMetric.totalDeployments(props._id, 'k8');
      setTotalDeployments(totalDeployments.length);
    };
    fetchTotalDeployments();
    setTotalDeployments('');
    const fetchTotalPod = async () => {
      const totalPods = await clusterMetric.totalPods(props._id, 'k8');
      setTotalPods(totalPods);
    };
    fetchTotalPod();
  }, []);

  //podMetric.nameList  - takes a {node} template literal - so will need to call this podMetric render within 
  
  //returns namespaces, nodes, deployments, services
  // //but it doesnt live in state at the given moment bc state doesnt persist. we can store it in state
  // //as long as we feel that refreshing isn't an issue - 
  // //that or we implement redux properly


  // //for time being we can go ahead and make a call
  // const { pods } = useAppSelector(state => state.node);
  // //
  // //(`http://localhost:30000/api/v1/query?query=kube_pod_info{node="${nodeName}"}`
  // const graph = {
  //   nodes: [
  //     { 
  //       id: 'control-plane', 
  //       label: 'Control Plane', 
  //       size: 45,
  //       font: { color: '#ffffff' }, 
  //       image: cpIcon, 
  //       shape: 'image',
  //       x: 200,
  //       y: 160
  //     },
  //   ],
  //   edges: []
  // };

  // // add a network node for each k8s node and point control plane node to each
  // nodes.forEach(nodeName => {
  //   const nodeNode = {
  //     id: `${nodeName}-node`,
  //     label: nodeName,
  //     size: 37.5,
  //     font: { color: '#ffffff' },
  //     image: nodeIcon, 
  //     shape: 'image'
  //   };
  //   graph.nodes.push(nodeNode);

  //   const cpEdge = {
  //     from: 'control-plane',
  //     to: nodeNode.id,
  //     width: 3,
  //     length: 500
  //   };

  //   graph.edges.push(cpEdge);

  //   // add a node for each namespace and point k8s node to each
  //   namespaces.forEach(ns => {
  //     const nsNode = {
  //       id: `${ns.metric.namespace}-ns`,
  //       label: ns.metric.namespace,
  //       size: 30,
  //       font: { color: '#ffffff' },
  //       image: nsIcon, 
  //       shape: 'image'
  //     };
  //     graph.nodes.push(nsNode);
  
  //     const nodeEdge = {
  //       from: nodeNode.id,
  //       to: nsNode.id,
  //       width: 2,
  //     };
  //     graph.edges.push(nodeEdge);
  
  //     // add a node for each pod in the namespace
  //     // and point the namespace to each
  //     pods
  //       .filter(pod => pod.metric.namespace === ns.metric.namespace)
  //       .forEach(pod => {
  //         const podNode = {
  //           id: `${pod.metric.pod}-pod`,
  //           label: pod.metric.pod,
  //           font: { color: '#ffffff' },
  //           image: podIcon, 
  //           shape: 'image'
  //         };
  //         graph.nodes.push(podNode);

  //         const nsEdge = {
  //           from: nsNode.id,
  //           to: podNode.id,
  //           width: 2
  //         };
  //         graph.edges.push(nsEdge);
          
  //         // point each deployment to the pods that it manage
  //         const deplEdge = {
  //           // extract deployment name
  //           from: `${pod.metric.created_by_name.replace(/-[^-]+$/i, '')}-depl`,
  //           to: podNode.id,
  //           width: 2, 
  //           color: '#ffffff',
  //           dashes: true
  //         };
  //         graph.edges.push(deplEdge);

  //       });

  //     // add a deployment node for each k8s node in the namespace
  //     // and point the namespace to each
  //     deployments.filter(depl => depl.metric.namespace === ns.metric.namespace)
  //       .forEach(depl => {
  //         const deplNode = {
  //           id: `${depl.metric.deployment}-depl`,
  //           label: depl.metric.deployment,
  //           font: { color: '#ffffff' },
  //           image: deplIcon, 
  //           shape: 'image'
  //         };
  //         graph.nodes.push(deplNode);

  //         const nsEdge = {
  //           from: nsNode.id,
  //           to: deplNode.id,
  //           width: 2
  //         };
  //         graph.edges.push(nsEdge);
  //       });
  
  //     // add a service node for each k8s node in the namespace
  //     // and point the namespace to each
  //     services.filter(svc => svc.metric.namespace === ns.metric.namaespace)
  //       .forEach(svc => {
  //         const svcNode = {
  //           id: `${svc.metric.service}-svc`,
  //           label: svc.metric.service,
  //           font: { color: '#ffffff' },
  //           image: svcIcon,
  //           shape: 'image'
  //         };
  //         graph.nodes.push(svcNode);

  //         const nsEdge = {
  //           from: nsNode.id,
  //           to: svcNode.id,
  //           width: 2
  //         };
  //         graph.edges.push(nsEdge);
  //       });
  
  //   });
  // });

  // // docs: https://visjs.github.io/vis-network/docs/network/
  // const options = {
  //   layout: {
  //     randomSeed: 10, // required for the x and y coordinates of CP node to be in a fixed position
  //     // uncomment to display nodes in a hierarchy
  //     // note: this will cause some pod labels overlap
  //     // hierarchical: {
  //     //   direction: "UD",
  //     //   sortMethod: "directed",
  //     // },
  //   },
  //   physics: {
  //     barnesHut: {
  //       gravitationalConstant: -1000,
  //       centralGravity: 0,
  //       springLength: 150,
  //       springConstant: 0.003,
  //       damping: 0.09
  //     },
  //   },
  //   edges: {
  //     color: '#8526d3',
  //   },
  // };

  // return(
  //   <Box sx={{ 
  //     flexGrow: 1,
  //     height: '90vh' }}> 
  //     <AppBar position='relative' sx={{
  //     }}>
  //       <Toolbar>
  //         <Typography variant='h5' component='div' sx={{ flexGrow: 1 }}>
  //         Visualizer
  //         </Typography>
  //       </Toolbar>
  //     </AppBar>
    
  //     <Graph
  //       graph={graph}
  //       options={options}
  //       getNetwork={(network) => {
  //         // ensure that the network eases in to fit the viewport
  //         setTimeout(() => network.fit({
  //           animation: {
  //             duration: 2000,
  //             easingFunction: 'linear'
  //           }
  //         }), 1000);
  //       }}
  //     />

  //   </Box>
  // );

  return (
    <div>
      will render here
    </div>
  );
};

export default Visualizer;
