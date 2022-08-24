import { Get } from '../Services';
import { apiRoute } from '../utils';

export const clusterMetric = {
  cpuLoad: async (clusterId: number, ns: string) => {
    const query = '(1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))*100'
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
  memoryLoad: async(clusterId: number, ns: string) => {
    const query = '(1-sum(kube_node_status_allocatable{resource="memory", unit="byte"})/sum(kube_node_status_capacity{resource="memory", unit="byte"}))*100'
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
  totalDeployments: async(clusterId: number, ns: string) => {
    const query = 'kube_deployment_created'
    try {
      const metric = await Get(apiRoute.getRoute(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      ))
        .then(res => res.json());
      const totalDeployments = metric.data.result;
      return totalDeployments;  
    } catch (err) {
      console.log(err);
    }
  },
  totalPods: async(clusterId: number, ns: string) => {
    const query = 'count(kube_pod_created)'
    try {
      const metric = await Get(apiRoute.getRoute(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      ))
        .then(res => res.json());
      const totalPods = metric.data.result[0].value[1];
      return totalPods;  
    } catch (err) {
      console.log(err);
    }
  },
  allServices: async(clusterId: number, ns: string) => {
    const query = 'kube_service_created'
    try {
      const metric = await Get(apiRoute.getRoute(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      ))
        .then(res => res.json());
      const allServices = metric.data.result;
      return allServices;  
    } catch (err) {
      console.log(err);
    }
  },
  allNamespaces: async(clusterId: number, ns: string) => {
    const query = 'kube_namespace_created'
    try {
      const metric = await Get(apiRoute.getRoute(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      ))
        .then(res => res.json());
      const namespaces = metric.data.result;
      return namespaces;
    } catch (err) {
      console.log(err);
    }
  }
}
