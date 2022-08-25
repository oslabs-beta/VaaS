import { Query } from '../Services';

const containerMetric = {
  containerNames: async (clusterId: string, ns: string) => {
    const query = `kube_pod_container_info`;
    try {
      const metric = await Query(clusterId, ns, query);
      return metric.data.result.map((result: { metric: { container: any; pod: any; }; }) => {
        return [result.metric.container, result.metric.pod];
      });
    } catch (err) {
      console.log(err);
    }
  },
  cpuUsage: async (clusterId: string, ns: string, container: string) => {
    const query = `rate(container_cpu_usage_seconds_total{container="${container}"}[10m])`;
    try {
      const metric = await Query(clusterId, ns, query);
      return metric.data.result[0].value;
    } catch (err) {
      console.log(err);
    }
  },
  rangeContainerCpuUsage: async (clusterId: string, ns: string, container: string, startTime: number, endTime: number) => {
    const query = `rate(container_cpu_usage_seconds_total{container="${container}"}[10m])&start=${startTime}&end=${endTime}&step=60s`;
    try {
      const metric = await Query(clusterId, ns, query);
      return metric.data.result[0].values;
    } catch (err) {
      console.log(err);
    }
  },
  rangeContainerCpuSaturation: async (clusterId: string, ns: string, container: string, startTime: number, endTime: number) => {
    const query = `rate(container_cpu_cfs_throttled_seconds_total{container="${container}"}[10m])&start=${startTime}&end=${endTime}&step=60s`;
    try {
      const metric = await Query(clusterId, ns, query);
      return metric.data.result.length === 0 ? 0 : metric.data.result[0].values;
    } catch (err) {
      console.log(err);
    }
  },
  rangeContainerMemoryUsage: async (clusterId: string, ns: string, container: string, startTime: number, endTime: number) => {
    const query = `container_memory_working_set_bytes{container="${container}"}&start=${startTime}&end=${endTime}&step=60s`;
    try {
      const metric = await Query(clusterId, ns, query);
      return metric.data.result[0].values;
    } catch (err) {
      console.log(err);
    }
  },
  rangeContainerMemorySaturation: async (clusterId: string, ns: string, container: string, startTime: number, endTime: number) => {
    const query = `sum(container_memory_working_set_bytes{container="${container}"})%20/%20sum(kube_pod_container_resource_limits{resource="memory",unit="byte",container="${container}"})&start=${startTime}&end=${endTime}&step=60s`;
    try {
      const metric = await Query(clusterId, ns, query);
      return metric.data.result.length === 0 ? 0 : metric.data.result[0].values;
    } catch (err) {
      console.log(err);
    }
  }
};

export default containerMetric;
