import { Terminal } from '@mui/icons-material';
import { Get } from '../Services';
import { apiRoute } from '../utils';

export default async function Alert(
  clusterId: string | unknown,
  ns: string,
  query: any
): Promise<any> {
  return await Get(apiRoute.getRoute(
    `/alert?id=${clusterId}&ns=${ns}&q=${query.name}&expr=${query.expression}&dur=${query.duration}`
  ), { authorization: localStorage.getItem('token') });
}

