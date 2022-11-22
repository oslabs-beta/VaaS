import { Alert } from '../Services';

const alertAdd = async (clusterId: string, ns: string, query: any) => {
  try {
    const metric = await Alert(clusterId, ns, query);
  } catch (err) {
    console.log('Error in Alert Add Query');
    console.log(err);
  }
};

export default alertAdd;