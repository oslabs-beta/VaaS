/*
look into what regenerator runtime this and if it's necessary
- says it is something to do with babel and async
 //import 'regenerator-runtime/runtime'; 

*/

 //return node CPU usage as a number
 export const fetchCpuUsage = async() => {
   const data = await fetch('http://localhost:30000/api/v1/query?query=(1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))*100', {
     method: 'GET',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     }
   })
   .then(res => res.json())
   const cpuUsage = parseInt(data.data.result[0].value[1]);
   return cpuUsage;
 }
 
 //return node memory usage as a number
 export const fetchMemoryUsage = async(nodeName) => {
   const data = await fetch(`http://localhost:30000/api/v1/query?query=(1-sum(kube_node_status_allocatable{resource="memory",unit="byte",node="${nodeName}"})/sum(kube_node_status_capacity{resource="memory",unit="byte",node="${nodeName}"}))*100`, {
     method: 'GET',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     }
   }).then(res => res.json())
   const memoryUsage = data.data.result[0].value[1];
   return memoryUsage;
 }
 
 // return all pods from a node
 export const fetchNodePods= async(nodeName) => {
   const data = await fetch(`http://localhost:30000/api/v1/query?query=kube_pod_info{node="${nodeName}"}`, {
     method: 'GET',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     }
   }).then(res => res.json())
   const podTotal= data.data.result;
   return podTotal;
 }
 
 //return pod capacity of node as a number
 export const fetchPodCapacity = async() => {
   const data = await fetch('http://localhost:30000/api/v1/query?query=kube_node_status_capacity{resource="pods"}', {
     method: 'GET',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     }
   }).then(res => res.json())
   const podCapacity= data.data.result[0].value[1];
   return podCapacity;
 }
 
 //return network utilization in kilobytes per second
 export const fetchNetworkUtilization = async() => {
   const received = await fetch('http://localhost:30000/api/v1/query?query=sum(rate(container_network_receive_bytes_total[5m]))', {
     method: 'GET',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     }
   }).then(res => res.json())
 
   const transmitted = await fetch('http://localhost:30000/api/v1/query?query=sum(rate(container_network_transmit_bytes_total[5m]))', {
     method: 'GET',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     }
   }).then(res => res.json())
 
   const networkUtilization = Math.floor((parseInt(received.data.result[0].value[1]) + parseInt(transmitted.data.result[0].value[1]))/1024);
   return networkUtilization;
 }
 
 //return network errors
   export const fetchNetworkErrors = async() => {
   const received = await fetch('http://localhost:30000/api/v1/query?query=sum(node_network_receive_errs_total)', {
     method: 'GET',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     }
   }).then(res => res.json())
 
   const transmitted = await fetch('http://localhost:30000/api/v1/query?query=sum(node_network_transmit_errs_total)', {
     method: 'GET',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     }
   }).then(res => res.json())
 
   const networkErrors = Math.floor((parseInt(received.data.result[0].value[1]) + parseInt(transmitted.data.result[0].value[1]))/1024);
   return networkErrors;
 }