import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../Store/hooks";
import { useLocation } from "react-router-dom";
import { nodeMetric, podMetric } from "../../Queries";

import Box from "@mui/material/Box";
import { Modal } from "@mui/material";

import { Modules } from "../../Interfaces/ICluster";
import { IReducers } from "../../Interfaces/IReducers";

import Graph from "react-graph-vis";
import cpIcon from "./icons/control-plane-icon.svg";
import nsIcon from "./icons/namespace-icon.svg";
import nodeIcon from "./icons/node-icon.svg";
import deplIcon from "./icons/deployment-icon.svg";
import svcIcon from "./icons/service-icon.svg";
import podIcon from "./icons/pod-icon.svg";

import "./network.css";
  

const Visualizer = (props: Modules) => {
  //Modal information and styling
  const [currPod, setCurrPod] = useState('');
  const [currJob, setCurrJob] = useState('');  
  const [currMemUseOfHovered, setCurrMemUseOfHovered] = useState('');
  const [currTimeSinceStart, setCurrTimeSinceStart] = useState('');
  const [currTimeSinceDeploy, setCurrTimeSinceDeploy] = useState('');
  const [showPopover, setShowPopover] = useState(false);
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  
  const apiReducer = useAppSelector((state: IReducers) => state.apiReducer);
  console.log(apiReducer.clusterDbData);
  console.log(apiReducer.clusterQueryData);

  // need to convert to redux
  const { state }: any = useLocation();
  const [id] = useState(props.id || state[0]);
  const [nameSpaces, setNameSpaces] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [totalDeployments, setTotalDeployments] = useState<any[]>([]);
  const [nameList, setNameList] = useState<any[]>([]);
  const [style, setStyle] = useState({
    color: "#00fff5",
  });
  const [offline, setOffline] = useState(false);
  console.log(apiReducer.clusterQueryData[id].allNamespaces);
  console.log(apiReducer.clusterQueryData[id].totalDeployments);

  useEffect(() => {
    if (!props.nested) {
      setStyle({ color: "black" });
    }
    
    if (!offline) {
      setNameSpaces(apiReducer.clusterQueryData[id].allNamespaces);
      setServices(apiReducer.clusterQueryData[id].allServices);
      setNodes(apiReducer.clusterQueryData[id].allNodes);
      setTotalDeployments(apiReducer.clusterQueryData[id].totalDeployments);
    } 
    
  }, []);

  useEffect(() => {
    //if we have multiple master nodes - we would need to do a foreach to iterate through nodes
    const nodeName = apiReducer.clusterQueryData[id].allNodes[0];
    const fetchNameList= async () => {
      const pods = await nodeMetric.nodePods(id, 'k8', nodeName);
      setNameList(pods);
      };
      fetchNameList();
  },[nodes]);

  const graph: any = {
    nodes: [
      {
        id: "control-plane",
        label: "Control Plane",
        size: 45,
        font: { color: style.color },
        image: cpIcon,
        shape: "image",
        x: 200,
        y: 160,
      },
    ],
    edges: [],
  };

  // add a network node for each k8s node and point control plane node to each

  nodes.forEach((nodeName) => {
    const nodeNode = {
      id: `${nodeName}-node`,
      label: `${nodeName}`,
      size: 37.5,
      font: { color: style.color },
      image: nodeIcon,
      shape: "image",
    };
    graph.nodes.push(nodeNode);

    const cpEdge = {
      from: "control-plane",
      to: nodeNode.id,
      width: 3,
      length: 500,
    };

    graph.edges.push(cpEdge);



    // const fetchNameList= async () => {
    //   const pods = await podMetric.namesList(id, 'k8', `${nodeName}`);
    //   setNameList(pods);
    // };
    // fetchNameList();

    // add a node for each namespace and point k8s node to each
    nameSpaces.forEach((ns) => {
      const nsNode = {
        id: `${ns.metric.namespace}-ns`,
        label: ns.metric.namespace,
        size: 30,
        font: { color: style.color },
        image: nsIcon,
        shape: "image",
      };
      graph.nodes.push(nsNode);

      const nodeEdge = {
        from: nodeNode.id,
        to: nsNode.id,
        width: 2,
      };
      graph.edges.push(nodeEdge);

      // add a node for each pod in the namespace
      // and point the namespace to each
      nameList
        .filter((nameList) => nameList.metric.namespace === ns.metric.namespace)
        .forEach((pod) => {
          const podNode = {
            id: `${pod.metric.pod}-pod`,
            // title: htmlTitle(`
            // <div>
            //   <dl>
            //     <dt>Pod Name:</dt>
            //     <dd>${currPod}</dd>
            //     <dt>Job:</dt>
            //     <dd>${currJob}</dd>
            //     <dt>Memory Use:</dt>
            //     <dd>${currMemUseOfHovered}</dd>
            //     <dt>Time Since Deploy</dt>
            //     <dd>${currTimeSinceDeploy}</dd>
            //     <dt>Time Since Start</dt>
            //     <dd>${currTimeSinceStart}</dd>
            //   </dl>
            // </div>`),
            label: pod.metric.pod,
            font: { color: style.color },
            image: podIcon,
            shape: "image",
          };
          graph.nodes.push(podNode);

          const nsEdge = {
            from: nsNode.id,
            to: podNode.id,
            width: 2,
          };
          graph.edges.push(nsEdge);

          // point each deployment to the pods that it manage
          const deplEdge = {
            // extract deployment name
            from: `${pod.metric.created_by_name.replace(/-[^-]+$/i, "")}-depl`,
            to: podNode.id,
            width: 2,
            color: style.color,
            dashes: true,
          };
          graph.edges.push(deplEdge);
        });

      // add a deployment node for each k8s node in the namespace
      // and point the namespace to each
      totalDeployments
        .filter((depl) => depl.metric.namespace === ns.metric.namespace)
        .forEach((depl) => {
          const deplNode = {
            id: `${depl.metric.deployment}-depl`,
            label: depl.metric.deployment,
            font: { color: style.color },
            image: deplIcon,
            shape: "image",
          };
          graph.nodes.push(deplNode);

          const nsEdge = {
            from: nsNode.id,
            to: deplNode.id,
            width: 2,
          };
          graph.edges.push(nsEdge);
        });

      // add a service node for each k8s node in the namespace
      // and point the namespace to each
      services
        .filter((svc) => svc.metric.namespace === ns.metric.namespace)
        .forEach((svc) => {
          const svcNode = {
            id: `${svc.metric.service}-svc`,
            label: svc.metric.service,
            font: { color: style.color },
            image: svcIcon,
            shape: "image",
          };
          graph.nodes.push(svcNode);

          const nsEdge = {
            from: nsNode.id,
            to: svcNode.id,
            width: 2,
          };
          graph.edges.push(nsEdge);
        });
    });
  });

  // docs: https://visjs.github.io/vis-network/docs/network/
  const options = {
    layout: {
      randomSeed: 10, // required for the x and y coordinates of CP node to be in a fixed position
      // uncomment to display nodes in a hierarchy
      // note: this will cause some pod labels overlap
      // hierarchical: {
      //   direction: "UD",
      //   sortMethod: "directed",
      // },
    },
    physics: {
      barnesHut: {
        gravitationalConstant: -2500,
        centralGravity: .05,
        springLength: 95,
        springConstant: 0.005,

        damping: 0.09,
        avoidOverlap: .75,
      },
    },
    edges: {
      color: "#8526d3",
    },
  };

  const events = {
    select: function(params: { nodes: any; edges: any;}) {
      const { nodes } = params;
      const clicked = nodes[0];
      const slicedClick = clicked.substring(clicked.length - 4, 0);
      // REMOVES THE '-POD' FROM LAST 4 CHARS

      const getPodInfo = async () => {
        //run the podInfo middleware to run a query to the prometheus server
        const data = podMetric.podInfoList(id,'k8',slicedClick);
        const resData = await data;
        const podInfo = resData?.metric.data.result[0];
        console.log('pod info', podInfo);
        console.log(podInfo.metric.job);
        setCurrPod(slicedClick);
        setCurrJob(podInfo.metric.job);
      };

      const getPodMemory = async () => {
        //run the podInfo middleware to run a query to the prometheus server
        const data = podMetric.podMem(id,'k8',slicedClick);
        const bytes = await data;
        const bytesToMb = (bytes?.metric.data.result[0].value[1])/1048576;
        //hard coded number is conversion of bytes to MB
        //window.alert(`This pod is using ${bytesToMb} MB of memory`);
        setCurrMemUseOfHovered(`${bytesToMb.toFixed(2)} MB`);
      };

      const getPodStart = async () => {
        //run the podInfo middleware to run a query to the prometheus server
        const data = podMetric.podStart(id,'k8',slicedClick);
        const seconds = await data;
        const unixTime = (seconds?.metric.data.result[0].value[1]);
        const currTime = Date.now()/1000;
        setCurrTimeSinceStart(`${Math.floor(((currTime-unixTime)/3600))} hours (${((currTime-unixTime)/60).toFixed(2)} minutes)`);
      };

      const getPodDeploy = async () => {
        //run the podInfo middleware to run a query to the prometheus server
        const data = podMetric.podDeployed(id,'k8',slicedClick);
        const seconds = await data;
        const unixTime = (seconds?.metric.data.result[0].value[1]);
        const currTime = Date.now()/1000;
        setCurrTimeSinceDeploy(`${Math.floor(((currTime-unixTime)/3600))} hours (${((currTime-unixTime)/60).toFixed(2)} minutes)`);
      };

      getPodInfo();
      getPodMemory();
      getPodDeploy();
      getPodStart();
      setShowPopover(true);

      //next steps, use some conditionals to check which node it is, have different formulas for pods, services, etc?

    }
  };
  
  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "90vh",
      }}
    >

      <Graph
        graph={graph}
        options={options}
        events={events}
        getNetwork={(network) => {
          // ensure that the network eases in to fit the viewport
          setTimeout(
            () => network.fit({
              animation: {
                duration: 1500,
                easingFunction: "linear",
              },
            }), 1000
          );
        }}
      />
      <Modal
        open={showPopover}
        onClose={()=>setShowPopover(false)}
        
        // anchorReference={'none'}
        // anchorPosition={
        // }
        // classes = {{
        //   root: classes.popOverRoot,
        // }}
      >
        <Box sx={modalStyle}>
          <dl>
            <dt>Pod Name:</dt>
            <dd>{currPod}</dd>
            <dt>Job:</dt>
            <dd>{currJob}</dd>
            <dt>Memory Use:</dt>
            <dd>{currMemUseOfHovered}</dd>
            <dt>Time Since Deploy</dt>
            <dd>{currTimeSinceDeploy}</dd>
            <dt>Time Since Start</dt>
            <dd>{currTimeSinceStart}</dd>
          </dl>        
        </Box>

      </Modal>
    </Box>
  );
};

export default Visualizer;
