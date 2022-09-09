import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../Store/hooks";
import { useLocation } from "react-router-dom";
import apiReducer from "../../Store/Reducers/apiReducer";
import { nodeMetric } from "../../Queries";
import Box from "@mui/material/Box";

import { Modules } from "../../Interfaces/ICluster";
import { IReducers } from "../../Interfaces/IReducers";

import Graph from "react-graph-vis";
import cpIcon from "./icons/control-plane-icon.svg";
import nsIcon from "./icons/namespace-icon.svg";
import nodeIcon from "./icons/node-icon.svg";
import deplIcon from "./icons/deployment-icon.svg";
import svcIcon from "./icons/service-icon.svg";
import podIcon from "./icons/pod-icon.svg";

const Visualizer = (props: Modules) => {
  
  const apiReducer = useAppSelector((state: IReducers) => state.apiReducer);
  console.log(apiReducer.clusterDbData);
  console.log(apiReducer.clusterQueryData);

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
    
  }, [nodes]);

  useEffect(() => {
    //if we have multiple master nodes - we would need to do a foreach to iterate through nodes
    const nodeName = apiReducer.clusterQueryData[id].allNodes[0];
    const fetchNameList= async () => {
      const pods = await nodeMetric.nodePods(id, 'k8', nodeName);
      setNameList(pods);
      };
      fetchNameList();
  },[]);

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
        gravitationalConstant: -1000,
        centralGravity: 0,
        springLength: 150,
        springConstant: 0.003,
        damping: 0.09,
      },
    },
    edges: {
      color: "#8526d3",
    },
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
        getNetwork={(network) => {
          // ensure that the network eases in to fit the viewport
          setTimeout(
            () => network.fit({
              animation: {
                duration: 2000,
                easingFunction: "linear",
              },
            }), 1000
          );
        }}
      />
    </Box>
  );
};

export default Visualizer;
