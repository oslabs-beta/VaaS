import { Get } from '../Services';
import { apiRoute } from '../utils';

// return a pod names as an array of strings
export const fetchPodNamesList = async (nodeName) => {
    const data = await fetch(`http://localhost:30000/api/v1/query?query=kube_pod_info{node="${nodeName}"}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json());
    const podNamesList = data.data.result.map(result => {
      return result.metric.pod;
    });
    return podNamesList;  
  };
  
  // return a pod info as an array of objects with {name, node, namespace, ip, deployment}
  export const fetchPodInfoList = async (nodeName) => {
    const data = await fetch(`http://localhost:30000/api/v1/query?query=kube_pod_info{node="${nodeName}"}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json());
    const podInfoList = data.data.result.map(result => {
      return { 
        podName: result.metric.pod, 
        podNamespace: result.metric.namespace, 
        podIp: result.metric.pod_ip, 
        createdByDeployment: result.metric.created_by_name,
        uid: result.metric.uid
      };
    });
    return podInfoList;  
  };
  
  export const fetchCurrentPodInfo = async (currentPod) => {
    const data = await fetch(`http://localhost:30000/api/v1/query?query=kube_pod_info{pod="${currentPod}"}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json());
    const currentPodInfo = {
      podName: data.data.result[0].metric.pod, 
      podNamespace: data.data.result[0].metric.namespace, 
      podIp: data.data.result[0].metric.pod_ip, 
      createdByDeployment: data.data.result[0].metric.created_by_name,
      uid: data.data.result[0].metric.uid
    };
    return currentPodInfo;  
  };