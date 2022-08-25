import { Get } from '../Services';
import { apiRoute } from '../utils';

export const podMetric = {
  namesList: async (clusterId: string, ns: string, node: string) => {
    const query = `kube_pod_info{node="${node}"}`;
    const metric = await Get(apiRoute.getRoute(
      `/prom?id=${clusterId}&ns=${ns}&q=${query}`
    ));
    return metric.data.result.map(result => {
      return result.metric.pod;
    });
  },
  infoList: async (clusterId: string, ns: string, node: string) => {
    const query = `kube_pod_info{node="${node}"}`;
    const metric = await Get(apiRoute.getRoute(
      `/prom?id=${clusterId}&ns=${ns}&q=${query}`
    ));
    return metric.data.result.map(result => {
      return {
        podName: result.metric.pod, 
        podNamespace: result.metric.namespace, 
        podIp: result.metric.pod_ip, 
        createdByDeployment: result.metric.created_by_name,
        uid: result.metric.uid
      };
    });
  },
  podInfo: async (clusterId: string, ns: string, pod: string) => {
    const query = `kube_pod_info{pod="${pod}"}`;
    const metric = await Get(apiRoute.getRoute(
      `/prom?id=${clusterId}&ns=${ns}&q=${query}`
    ));
    return {
      podName: metric.data.result[0].metric.pod, 
      podNamespace: metric.data.result[0].metric.namespace, 
      podIp: metric.data.result[0].metric.pod_ip, 
      createdByDeployment: metric.data.result[0].metric.created_by_name,
      uid: metric.data.result[0].metric.uid
    };
  }
};
