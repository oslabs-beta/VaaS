import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Modules } from "../../Interfaces/ICluster";
import { clusterMetric, podMetric } from "../../Queries";
import Box from "@mui/material/Box";

import Graph from "react-graph-vis";
import cpIcon from "./icons/control-plane-icon.svg";
import nsIcon from "./icons/namespace-icon.svg";
import nodeIcon from "./icons/node-icon.svg";
import deplIcon from "./icons/deployment-icon.svg";
import svcIcon from "./icons/service-icon.svg";
import podIcon from "./icons/pod-icon.svg";

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
  const { state }: any = useLocation();
  const [id] = useState(props.id || state[0]);
  const [nameSpaces, setNameSpaces] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [totalDeployments, setTotalDeployments] = useState<any[]>([]);
  const [nameList, setNameList] = useState<any[]>([]);
  const [style, setStyle] = useState({
    color: "#FFFFFF",
  });
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!props.nested) {
      setStyle({ color: "black" });
    }
    const fetchNamespaces = async () => {
      let namespaces;
      try {
        namespaces = await clusterMetric.allNamespaces(id, "k8");
      } catch (err) {
        setOffline(true);
      }
      if (!offline) setNameSpaces(namespaces);
    };
    fetchNamespaces();
    const fetchServices = async () => {
      const services = await clusterMetric.allServices(id, "k8");
      if (!offline) setServices(services);
    };
    fetchServices();
    const fetchNodes = async () => {
      const nodes = await clusterMetric.allNodes(id, "k8");
      if (!offline) setNodes(nodes);
    };
    fetchNodes();
    const fetchTotalDeployments = async () => {
      const totalDeployments = await clusterMetric.totalDeployments(id, "k8");
      if (!offline) setTotalDeployments(totalDeployments);
    };
    // updateColor();
    fetchTotalDeployments();
    // const fetchNameList= async () => {
    //   const pods = await podMetric.namesList(id, 'k8', `${nodeName}`);
    //   setNameList(pods);
    //   };
    // fetchNameList();
  }, []);
    console.log(`nameSpaces: ${typeof nameSpaces}, services:  ${typeof services}, allNodes ${typeof nodes}, totalDeployments:  ${typeof totalDeployments}`);
    // console.log(nameSpaces);
    // console.log(services);
    // console.log(nodes);
    // console.log(totalDeployments);
  //podMetric.nameList  - takes a {node} template literal - so will need to call this podMetric render within

  //returns namespaces, nodes, deployments, services
  // //but it doesnt live in state at the given moment bc state doesnt persist. we can store it in state
  // //as long as we feel that refreshing isn't an issue -
  // //that or we implement redux properly

  // //for time being we can go ahead and make a call
  // const { pods } = useAppSelector(state => state.node);
  // //
  // //(`http://localhost:30000/api/v1/query?query=kube_pod_info{node="${nodeName}"}`
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
    //   };
    // fetchNameList();

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
      {/* <AppBar position='relative' sx={{
      }}>
        <Toolbar>
          <Typography variant='h5' component='div' sx={{ flexGrow: 1 }}>
          Visualizer
          </Typography>
        </Toolbar>
      </AppBar> */}

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
