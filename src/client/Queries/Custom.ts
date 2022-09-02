import { Query } from '../Services';

const customMetric = async (clusterId: string, ns: string, query: string) => {
  try {
    const metric = await Query(clusterId, ns, query);
    return metric.data.result;
  } catch (err) {
    console.log(err);
  }
};

export default customMetric;