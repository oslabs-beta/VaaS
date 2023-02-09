import { GateWayQuery } from '../Services/Query';

const openFaasMetric = {
  avgTimePerInvoke: async (clusterId: string, type: string, query: string) => {
    try {
      const metric = await GateWayQuery(clusterId, query, type);

      // need to adjust here depending on how we want to display data
      return metric;
    } catch (err) {
      console.log(err);
    }
  },
  //
};

export default openFaasMetric;
