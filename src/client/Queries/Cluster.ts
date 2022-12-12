import { useEffect, useState } from 'react';
import axiosInstance from './axios';
import { useFetchMetricsProps } from '../Interfaces/ICluster';
import { storeClusterQueryData } from '..//Store/actions';
import { useAppDispatch } from '../Store/hooks';
import { AddClusterType } from '../Interfaces/ICluster';
import { AxiosRequestConfig } from 'axios';

export const fetchClusters = async () => {
  const data = await axiosInstance('/cluster');
  return data.data;
};

export const fetchSingleCluster = async (clusterName: string | undefined) => {
  const data = await axiosInstance(`/cluster:${clusterName}`);
  return data.data;
};

export const addCluster = async (payload: AddClusterType) => {
  const data = await axiosInstance.post('/cluster', payload);
  return data.data;
};

export const deleteCluster = async (
  payload:
    | AxiosRequestConfig<{
        clusterId: string | undefined;
      }>
    | undefined
) => {
  const data = await axiosInstance.delete('/cluster', payload);
  return data.data;
};

export const editCluster = async (
  payload: AxiosRequestConfig<any> | undefined
) => {
  const data = await axiosInstance.put('/cluster', payload);
  return data.data;
};

export const clusterMetric = {
  cpuLoad: async (clusterId: string, ns: string) => {
    const query =
      '(1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))*100';
    try {
      // make prom query for cpuLoad
      const metric = await axiosInstance(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      );
      // extract array of result from api call
      const result = metric.data.data.result;
      // get average of cpuLoad of all nodes of the cluster
      const average =
        result.reduce((acc: number, curr: { value: string | number[] }) => {
          return acc + Number(curr.value[1]);
        }, 0) / result.length;
      // return the average
      return average;
    } catch (err) {
      console.log(err);
    }
  },
  memoryLoad: async (clusterId: string | undefined, ns: string) => {
    const query =
      '(1-sum(kube_node_status_allocatable{resource="memory", unit="byte"})/sum(kube_node_status_capacity{resource="memory", unit="byte"}))*100';
    try {
      // make prom query for memoryLoad
      const metric = await axiosInstance(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      );
      // extract needed result from api call
      return metric.data.data.result[0].value[0];
    } catch (err) {
      console.log(err);
    }
  },
  totalDeployments: async (clusterId: string | undefined, ns: string) => {
    const query = 'kube_deployment_created';
    try {
      // make prom query for totalDeployments
      const metric = await axiosInstance(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      );
      // extract needed data from api call
      return metric.data.data.result.length;
    } catch (err) {
      console.log(err);
    }
  },
  totalPods: async (clusterId: string | unknown, ns: string) => {
    const query = 'count(kube_pod_created)';
    try {
      // make prom query for totalPods
      const metric = await axiosInstance(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      );
      // extract needed data from api call
      return metric.data.data.result[0].value[1];
    } catch (err) {
      console.log(err);
    }
  },
  allServices: async (clusterId: string | undefined, ns: string) => {
    const query = 'kube_service_created';
    try {
      // make prom query for allServices
      const metric = await axiosInstance(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      );
      // extract needed data from api call
      return metric.data.data.result.length;
    } catch (err) {
      console.log(err);
    }
  },
  allNamespaces: async (clusterId: string | undefined, ns: string) => {
    const query = 'kube_namespace_created';
    try {
      // make prom query for allNamespaces
      const metric = await axiosInstance(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      );
      // extract needed result from api call
      return metric.data.data.result;
    } catch (err) {
      console.log(err);
    }
  },
  allNodes: async (clusterId: string | undefined, ns: string) => {
    const query = 'kube_node_info';
    try {
      // make prom query for allNamespaces
      const metric = await axiosInstance(
        `/prom?id=${clusterId}&ns=${ns}&q=${query}`
      );
      // extract needed property from the result from api call
      return metric.data.data.result.map(
        //map through the result to extract the node
        (result: { metric: { node: string } }) => {
          return result.metric.node;
        }
      );
    } catch (err) {
      console.log(err);
    }
  },
};

// custom hook to be used by each Kube (Kube.tsx) created from the clusters in Home.tsx to fetch metrics of the cluster
export const useFetchMetrics = ({ clusterId, k8Str }: useFetchMetricsProps) => {
  const dispatch = useAppDispatch();
  const [allNodes, setAllNodes] = useState(null);
  const [cpuLoad, setCpuLoad] = useState<string>('');
  const [memoryLoad, setMemoryLoad] = useState<number>();
  const [totalDeployments, setTotalDeployments] = useState(null);
  const [totalPods, setTotalPods] = useState(null);
  const [allNamespaces, setAllNamespaces] = useState(null);
  const [allServices, setAllServices] = useState(null);

  useEffect(() => {
    // fetch all nodes on cluster
    const fetchNodes = async () => {
      const res = await clusterMetric.allNodes(clusterId, k8Str);
      if (res) setAllNodes(res);
    };
    fetchNodes();
    // fetch cpu usage of nodes on cluster
    const fetchCpuUsage = async () => {
      const res = await clusterMetric.cpuLoad(clusterId, k8Str);
      if (res) setCpuLoad(res.toFixed(1));
    };
    fetchCpuUsage();
    // fetch memory usage of nodes on cluster
    const fetchMemoryUsage = async () => {
      const res = await clusterMetric.memoryLoad(clusterId, k8Str);
      if (res) setMemoryLoad(Number((res / 1000000).toFixed(1)));
    };
    fetchMemoryUsage();
    // fetch total deployments on cluster
    const fetchTotalDeployments = async () => {
      const res = await clusterMetric.totalDeployments(clusterId, k8Str);
      if (res) setTotalDeployments(res);
    };
    fetchTotalDeployments();
    // fetch total pods on cluster
    const fetchTotalPods = async () => {
      const res = await clusterMetric.totalPods(clusterId, k8Str);
      if (res) setTotalPods(res);
    };
    fetchTotalPods();
    // fetch all namespaces on cluster
    const fetchNamespaces = async () => {
      const res = await clusterMetric.allNamespaces(clusterId, k8Str);
      if (res) setAllNamespaces(res);
    };
    fetchNamespaces();
    // fetch all services on cluster
    const fetchServices = async () => {
      const res = await clusterMetric.allServices(clusterId, k8Str);
      if (res) setAllServices(res);
    };
    fetchServices();
  }, [clusterId, k8Str]);

  // only dispatch to storeClusterQueryData if all metrics are confirmed fetched
  useEffect(() => {
    if (
      allNodes &&
      cpuLoad &&
      memoryLoad &&
      totalDeployments &&
      totalPods &&
      allNamespaces &&
      allServices
    )
      dispatch(
        storeClusterQueryData(clusterId, {
          allNodes,
          cpuLoad,
          memoryLoad,
          totalDeployments,
          totalPods,
          allNamespaces,
          allServices,
        })
      );
  }, [
    allNodes,
    cpuLoad,
    memoryLoad,
    totalDeployments,
    totalPods,
    allNamespaces,
    allServices,
    dispatch,
    clusterId,
  ]);

  // return metrics
  return {
    allNodes,
    cpuLoad,
    memoryLoad,
    totalDeployments,
    totalPods,
    allNamespaces,
    allServices,
  };
};

export default clusterMetric;
