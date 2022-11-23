import { Query } from '../Services';

// custom prom ql
const customMetric = async (clusterId: string, ns: string, query: string) => {
  try {
    const metric = await Query(clusterId, ns, query);
    console.log('\u001b[1;31mQuery result', metric);
    return metric.data.result;
  } catch (err) {
    console.log(err);
  }
};

export default customMetric;
