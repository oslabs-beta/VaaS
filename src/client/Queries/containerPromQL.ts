import { Get } from '../Services';
import { apiRoute } from '../utils';

export const containerMetric = {
  containerNames: async (clusterId: string, ns: string) => {
    const query = `kube_pod_container_info`;
    const metric = await Get(apiRoute.getRoute(
      `/prom?id=${clusterId}&ns=${ns}&q=${query}`
    ));
    return metric.data.result.map(result => {
      return [ result.metric.container, result.metric.pod]
    });
  },
  cpuUsage: async (clusterId: string, ns: string, container: string, startTime:, endTime:) => {
    const query = `rate(container_cpu_usage_seconds_total{container="${container}"}[10m])`;
    const metric = await Get(apiRoute.getRoute(
      `/prom?id=${clusterId}&ns=${ns}&q=${query}`
    ));
    return metric.data.result[0].value;
  },
  rangeContainerCpuUsage: async (clusterId: string, ns: string, container: string, startTime: number, endTime: number) => {
    const query = `rate(container_cpu_usage_seconds_total{container="${container}"}[10m])&start=${startTime}&end=${endTime}&step=60s`
    const metric = await Get(apiRoute.getRoute(
      `/prom?id=${clusterId}&ns=${ns}&q=${query}`
    ));
    return metric.data.result[0].values
  },
  rangeContainerCpuSaturation: async (clusterId: string, ns: string, container: string, startTime:number, endTime:number) => {
    const query = `rate(container_cpu_cfs_throttled_seconds_total{container="${container}"}[10m])&start=${startTime}&end=${endTime}&step=60s`;
    const metric = await Get(apiRoute.getRoute(
      `/prom?id=${clusterId}&ns=${ns}&q=${query}`
    ));
    return metric.data.result.length === 0 ? 0 : metric.data.result[0].values;
  },

};




// returns an array of Memory usage values between an input start and end time, in 60s intervals
// for each element in the array, element[0] = unixtimestamp, element[1] = Memory working in bytes
// working_set_bytes: more realistic measurement than usage_bytes
export const fetchRangeContainerMemoryUsage = async (containerName, startTime, endTime) => {
  const data = await fetch(`http://localhost:30000/api/v1/query_range?query=container_memory_working_set_bytes{container="${containerName}"}&start=${startTime}&end=${endTime}&step=60s`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json());

  const rangeContainerMemoryUsage = data.data.result[0].values;
  return rangeContainerMemoryUsage;  
};

// returns an array of Memory saturation values between an input start and end time, in 60s intervals
// for each element in the array, element[0] = unixtimestamp, element[1] = Memory saturation as a ratio of memory in use against memory limit allocated to container
// NOTE: kube_pod_container_resource_limits is experimental, meaning it could change at any time. 
// possibly can be replaced by container_spec_memory_limit_bytes, which returns 0 if no limit is set
// info on setting memory limits: https://sysdig.com/blog/kubernetes-resource-limits/
export const fetchRangeContainerMemorySaturation = async (containerName, startTime, endTime) => {
  let rangeContainerMemorySaturation;
  const data = await fetch(`http://localhost:30000/api/v1/query_range?query=sum(container_memory_working_set_bytes{container="${containerName}"})%20/%20sum(kube_pod_container_resource_limits{resource="memory",unit="byte",container="${containerName}"})&start=${startTime}&end=${endTime}&step=60s`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json());
  if (data.data.result = []) {
    rangeContainerMemorySaturation = 0;
  } else {
    rangeContainerMemorySaturation = data.data.result[0].values;
  }

  return rangeContainerMemorySaturation;  
};