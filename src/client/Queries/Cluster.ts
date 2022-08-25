import { Get } from '../Services';
import { apiRoute } from '../utils';

const clusterMetric = {
  token: { authorization: localStorage.getItem('token') },
  cpuLoad: async (clusterId: string | undefined, ns: string) => {
    const query = '(1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))*100';
    try {
      const metric = await Get(apiRoute.getRoute(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      ), clusterMetric.token);
      return parseInt(metric.data.result[0].value[1]);
    } catch (err) {
      console.log(err);
    }
  },
  memoryLoad: async(clusterId: string | undefined, ns: string) => {
    const query = '(1-sum(kube_node_status_allocatable{resource="memory", unit="byte"})/sum(kube_node_status_capacity{resource="memory", unit="byte"}))*100';
    try {
      const metric = await Get(apiRoute.getRoute(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      ), clusterMetric.token);
      return metric.data.result[0].value[1];
    } catch (err) {
      console.log(err);
    }
  },
  totalDeployments: async(clusterId: string | undefined, ns: string) => {
    const query = 'kube_deployment_created';
    try {
      const metric = await Get(apiRoute.getRoute(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      ), clusterMetric.token);
      return metric.data.result;
    } catch (err) {
      console.log(err);
    }
  },
  totalPods: async(clusterId: string | undefined, ns: string) => {
    const query = 'count(kube_pod_created)';
    try {
      const metric = await Get(apiRoute.getRoute(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      ), clusterMetric.token);
      return metric.data.result[0].value[1];
    } catch (err) {
      console.log(err);
    }
  },
  allServices: async(clusterId: string | undefined, ns: string) => {
    const query = 'kube_service_created';
    try {
      const metric = await Get(apiRoute.getRoute(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      ), clusterMetric.token);
      return metric.data.result;
    } catch (err) {
      console.log(err);
    }
  },
  allNamespaces: async(clusterId: string | undefined, ns: string) => {
    const query = 'kube_namespace_created';
    try {
      const metric = await Get(apiRoute.getRoute(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      ), clusterMetric.token);
      return metric.data.result;
    } catch (err) {
      console.log(err);
    }
  },
  allNodes: async (clusterId: string | undefined, ns: string) => {
    const query = 'kube_node_info';
    try {
      const metric = await Get(apiRoute.getRoute(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      ), clusterMetric.token);
      return metric.data.result.map((result: { metric: { node: string } }) => {
        return result.metric.node;
      });
    } catch (err) {
      console.log(err);
    }
  }
};

export default clusterMetric;