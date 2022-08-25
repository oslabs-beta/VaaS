import { Get } from '../Services';
import { apiRoute } from '../utils';


export const nodeMetric = {
  cpuLoad: async (clusterId: string, ns: string) => {
    const query = '(1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))*100';
    try {
      const metric = await Get(apiRoute.getRoute(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      ))
        .then(res => res.json());
      const cpuLoad= parseInt(metric.data.result[0].value[1]);
      return cpuLoad;  
    } catch (err) {
      console.log(err);
    }
  },
  memoryLoad: async(clusterId: string, ns: string, node: string) => {
    const query = `(1-sum(kube_node_status_allocatable{resource="memory",unit="byte",node="${node}"})) / sum(kube_node_status_capacity{resource="memory",unit="byte",node="${node}"}))*100`;
    try {
      const metric = await Get(apiRoute.getRoute(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      ))
        .then(res => res.json());
      const memoryLoad = metric.data.result[0].value[1];
      return memoryLoad;
    } catch (err) {
      console.log(err);
    }
  },
  nodePods : async(clusterId: string, ns: string, node : string) => {
   const query = `(kube_pod_info{node="${node}"})`;
   try {
     const metric = await Get(apiRoute.getRoute(
       `/prom?id=${clusterId}&ns=${ns}&q=${query}`
     ))
      .then(res=> res.json());
      const podTotal = metric.data.result[0];
      return podTotal;
     } catch (err) {
       console.log(err);
     }
  },
  podCapacity: async(clusterId: string, ns: string) => {
    const query = '(kube_node_status_capacity{resource="pods"})';
    try {
      const metric = await Get(apiRoute.getRoute(
        `/prom?q=${clusterId}&ns=${ns}&q=${query}`
      ))
      .then(res => res.json());
      const podCapacity = metric.data.result[0].value[1];
      return podCapacity;
    } catch (err) {
      console.log(err);
    }
  },
  networkUtilization: async(clusterId: string, ns: string) => {
    const query1 = 'sum(rate(container_network_receive_bytes_total[5m])';
    const query2 = 'sum(rate(container_network_transmit_bytes_total[5m]))';
    try {
      const metric1 = await Get(apiRoute.getRoute(
        `/prom?q=${clusterId}&ns=${ns}&q=${query1}`
      ))
      .then(res => res.json());
      const metric2 = await Get(apiRoute.getRoute(
        `/prom?q=${clusterId}&ns=${ns}&q=${query2}`
      ))
      .then(res => res.json());
      const networkUtilization = Math.floor((parseInt(metric1.data.result[0].value[1]))+ parseInt(metric2.data.result[0].value[1])/1024);
      return networkUtilization;
    } catch (err) {
      console.log(err);
    }
  },
 
 //return network errors
 networkErrors: async(clusterId: string, ns: string) => {
    const query1 = 'query=sum(node_network_receive_errs_total)';
    const query2 = 'query=sum(node_network_transmit_errs_total)';
    try {
      const metric1 = await Get(apiRoute.getRoute(
        `prom?q=${clusterId}&ns=${ns}&q=${query1}`
      ))
      .then (res => res.json());
      const metric2 = await Get(apiRoute.getRoute(
        `prom?q=${clusterId}&ns=${ns}&q=${query2}`
      ))
      .then (res => res.json());
      const networkErrors = Math.floor((parseInt(metric1.data.result[0].value[1]) + parseInt(metric2.data.result[0].value[1]))/1024);
      return networkErrors;
    } catch (err) {
      console.log(err);
    }
  },
};
