import { Get } from '../Services';
import { apiRoute } from '../utils';

export default async function Query(
  clusterId: string | unknown,
  ns: string,
  query: string
): Promise<any> {
  return await Get(apiRoute.getRoute(
    `/prom?id=${clusterId}&ns=${ns}&q=${query}`
  ), { authorization: localStorage.getItem('token') });
}

export async function GateWayQuery(
  clusterId: string | unknown,
  query: string,
  type: string
): Promise<any> {
  return await Get(apiRoute.getRoute(
    `/gateway?id=${clusterId}&type=${type}q=${query}`
  ), { authorization: localStorage.getItem('token') });
}
