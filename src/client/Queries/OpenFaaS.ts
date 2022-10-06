import { GateWayQuery } from '../Services';

const openFaasMetric = {
  avgTimePerInvoke: async (clusterId: string, function_name: string) => {
    const query = `gateway_functions_seconds_sum{function_name="${function_name}"}/gateway_function_invocation_total{function_name="${function_name}"}`;
    const type = 'avg';
    try {
      const metric = await GateWayQuery(clusterId, type, query);
      console.log(metric);
      // need to adjust here depending on how we want to display data
      return metric;
    }
    catch (err) {
      console.log(err);
    }
  }
  // 
};


export default openFaasMetric;
