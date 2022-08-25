import { Get } from '../Services';
import { apiRoute } from '../utils';

export const containerMetric = {
  containerNames: async (clusterId: string, ns: string) => {
    const query = `kube_pod_container_info`;
    const metric = await Get(apiRoute.getRoute(
      `/prom?id=${clusterId}&ns=${ns}&q=${query}`
    ));
    return metric.data.result.map(result => {
      return [ result.metric.container, result.metric.pod];
    });
  },
  cpuUsage: async (clusterId: string, ns: string, container: string) => {
    const query = `rate(container_cpu_usage_seconds_total{container="${container}"}[10m])`;
    const metric = await Get(apiRoute.getRoute(
      `/prom?id=${clusterId}&ns=${ns}&q=${query}`
    ));
    return metric.data.result[0].value;
  },
  rangeContainerCpuUsage: async (clusterId: string, ns: string, container: string, startTime: number, endTime: number) => {
    const query = `rate(container_cpu_usage_seconds_total{container="${container}"}[10m])&start=${startTime}&end=${endTime}&step=60s`;
    const metric = await Get(apiRoute.getRoute(
      `/prom?id=${clusterId}&ns=${ns}&q=${query}`
    ));
    return metric.data.result[0].values;
  },
  rangeContainerCpuSaturation: async (clusterId: string, ns: string, container: string, startTime: number, endTime: number) => {
    const query = `rate(container_cpu_cfs_throttled_seconds_total{container="${container}"}[10m])&start=${startTime}&end=${endTime}&step=60s`;
    const metric = await Get(apiRoute.getRoute(
      `/prom?id=${clusterId}&ns=${ns}&q=${query}`
    ));
    return metric.data.result.length === 0 ? 0 : metric.data.result[0].values;
  },
  rangeContainerMemoryUsage: async (clusterId: string, ns: string, container: string, startTime: number, endTime: number) => {
    const query = `container_memory_working_set_bytes{container="${container}"}&start=${startTime}&end=${endTime}&step=60s`;
    const metric = await Get(apiRoute.getRoute(
      `/prom?id=${clusterId}&ns=${ns}&q=${query}`
    ));
    return metric.data.result[0].values;
  },
  rangeContainerMemorySaturation: async (clusterId: string, ns: string, container: string, startTime: number, endTime: number) => {
    const query = `sum(container_memory_working_set_bytes{container="${container}"})%20/%20sum(kube_pod_container_resource_limits{resource="memory",unit="byte",container="${container}"})&start=${startTime}&end=${endTime}&step=60s`;
    const metric = await Get(apiRoute.getRoute(
      `/prom?id=${clusterId}&ns=${ns}&q=${query}`
    ));
    return metric.data.result.length === 0 ? 0 : metric.data.result[0].values;
  }
};
