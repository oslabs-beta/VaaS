import { GateWayQuery } from '../Services/Query';

const openFaasMetric = {
  avgTimePerInvoke: async (clusterId: string, type: string, query: string) => {
    try {
      //console.log('TYPE IS', type);
      //console.log('query is:', query);
      const metric = await GateWayQuery(clusterId, query, type);
      // .then(res => //console.log('DATA RETURNED IS', metric));

      // need to adjust here depending on how we want to display data
      return metric;
    } catch (err) {
      //console.log(err);
    }
  },
  //
};

export default openFaasMetric;
