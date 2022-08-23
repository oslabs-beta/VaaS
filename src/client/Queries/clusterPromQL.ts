export const fetchClusterCpuUsage = async () => {

  //
  const data = await fetch('http://localhost:30000/api/v1/query?query=(1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))*100', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json());
  const clusterCpuUsage= parseInt(data.data.result[0].value[1]);
  return clusterCpuUsage;  
}

export const fetchClusterMemoryUsage = async() => {
  const data = await fetch('http://localhost:30000/api/v1/query?query=(1-sum(kube_node_status_allocatable{resource="memory", unit="byte"})/sum(kube_node_status_capacity{resource="memory", unit="byte"}))*100', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  const clusterMemoryUsage = data.data.result[0].value[1];
  return clusterMemoryUsage;
}

export const fetchTotalDeployments = async () => {
  const data = await fetch('http://localhost:30000/api/v1/query?query=kube_deployment_created', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json());

  const totalDeployments = data.data.result;
  return totalDeployments;  
}

export const fetchTotalPods = async () => {
  const data = await fetch('http://localhost:30000/api/v1/query?query=count(kube_pod_created)', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json());
  const totalPods = data.data.result[0].value[1];
  return totalPods;  
}

export const fetchAllServices = async () => {
  const data = await fetch('http://localhost:30000/api/v1/query?query=kube_service_created', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json());
  const totalServices = data.data.result;
  return totalServices;  
}

export const fetchAllNamespaces = async () => {
  const data = await fetch('http://localhost:30000/api/v1/query?query=kube_namespace_created', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json());

  const namespaces = data.data.result;
  return namespaces;
}