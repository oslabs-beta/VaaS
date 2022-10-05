import { Query } from '../Services';

const podMetric = {
  namesList: async (clusterId: string | undefined, ns: string, node: string) => {
    const query = `kube_pod_info{node="${node}"}`;
    try {
      const metric = await Query(clusterId, ns, query);
      return metric.data.result.map((result: { metric: { pod: any; }; }) => {
        return result.metric.pod;
      });
    } catch (err) {
      console.log(err);
    }
  },
  infoList: async (clusterId: string, ns: string, node: string) => {
    const query = `kube_pod_info{node="${node}"}`;
    try {
      const metric = await Query(clusterId, ns, query);
      return metric.data.result.map((result: { metric: { pod: any; namespace: any; pod_ip: any; created_by_name: any; uid: any; }; }) => {
        return {
          podName: result.metric.pod, 
          podNamespace: result.metric.namespace, 
          podIp: result.metric.pod_ip, 
          createdByDeployment: result.metric.created_by_name,
          uid: result.metric.uid
        };
      });
    } catch (err) {
      console.log(err);
    }
  },
  podInfo: async (clusterId: string, ns: string, pod: string) => {
    const query = `container_memory_usage_bytes{pod="${pod}"}`;
    try {
      const metric = await Query(clusterId, ns, query);
      return {
        metric: metric,
      };
    } catch (err) {
      console.log(err);
    }
  }
};

export default podMetric;
