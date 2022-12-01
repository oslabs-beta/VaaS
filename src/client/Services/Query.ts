import { Get } from '../Services';
import { apiRoute } from '../utils';

export async function GateWayQuery(
  clusterId: string | unknown,
  query: string,
  type: string
): Promise<any> {
  return await Get(
    apiRoute.getRoute(`/gateway?id=${clusterId}&q=${query}&type=${type}`),
    { authorization: localStorage.getItem('token') }
  );
}

// !! Pretty sure all of our issues are stemming from here!!
export default async function Query(
  clusterId: string | unknown,
  ns: string,
  query: string
): Promise<any> {
  console.log('Query params:', clusterId, ns, query);
  return await Get(
    apiRoute.getRoute(`/prom?id=${clusterId}&ns=${ns}&q=${query}`)
    // ,{ authorization: localStorage.getItem('token') }
  );
}
