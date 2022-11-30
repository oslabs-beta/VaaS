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

export default async function Query(
  clusterId: string | unknown,
  ns: string,
  query: string
): Promise<any> {
  return await Get(
    apiRoute.getRoute(`/prom?id=${clusterId}&ns=${ns}&q=${query}`),
    { authorization: localStorage.getItem('token') }
  );
}
