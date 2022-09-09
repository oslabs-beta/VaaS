import { Query } from '../Services';

const nodeMetric = {
  cpuLoad: async (clusterId: string | undefined, ns: string) => {
    const query = '(1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))*100';
    try {
      const metric = await Query(clusterId, ns, query);
      return parseInt(metric.data.result[0].value[1]);
    } catch (err) {
      console.log(err);
    }
  },
  memoryLoad: async(clusterId: string | undefined, ns: string, node: string) => {
    const query = `(1-sum(kube_node_status_allocatable{resource="memory",unit="byte",node="${node}"})) / sum(kube_node_status_capacity{resource="memory",unit="byte",node="${node}"}))*100`;
    try {
      const metric = await Query(clusterId, ns, query);
      return metric.data.result[0].value[1];
    } catch (err) {
      console.log(err);
    }
  },
  nodePods: async(clusterId: string, ns: string, node : string) => {
    const query = `(kube_pod_info{node="${node}"})`;
    try {
      const metric = await Query(clusterId, ns, query);
      return metric.data.result;
    } catch (err) {
      console.log(err);
    }
  },
  podCapacity: async(clusterId: string, ns: string) => {
    const query = '(kube_node_status_capacity{resource="pods"})';
    try {
      const metric = await Query(clusterId, ns, query);
      return metric.data.result[0].value[1];
    } catch (err) {
      console.log(err);
    }
  },
  networkUtilization: async(clusterId: string, ns: string) => {
    const query1 = 'sum(rate(container_network_receive_bytes_total[5m])';
    const query2 = 'sum(rate(container_network_transmit_bytes_total[5m]))';
    try {
      const metric1 = await Query(clusterId, ns, query1);
      const metric2 = await Query(clusterId, ns, query2);
      return Math.floor((parseInt(metric1.data.result[0].value[1])) + parseInt(metric2.data.result[0].value[1]) / 1024);
    } catch (err) {
      console.log(err);
    }
  },
  networkErrors: async(clusterId: string, ns: string) => {
    const query1 = 'query=sum(node_network_receive_errs_total)';
    const query2 = 'query=sum(node_network_transmit_errs_total)';
    try {
      const metric1 = await Query(clusterId, ns, query1);
      const metric2 = await Query(clusterId, ns, query2);
      return Math.floor((parseInt(metric1.data.result[0].value[1]) + parseInt(metric2.data.result[0].value[1])) / 1024);
    } catch (err) {
      console.log(err);
    }
  },
};

export default nodeMetric;
