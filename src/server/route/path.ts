import { IPath, IPathRoute } from '../interfaces/IPath';

function path(url: string): IPathRoute {
  const allRoutes: IPath = {
    '/user': {
      methods: ['GET', 'PUT', 'DELETE'],
    },
    '/auth': {
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    '/cluster': {
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    '/prom': {
      methods: ['GET'],
    },
    '/faas': {
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    '/faas/invoke': {
      methods: ['POST'],
    },
    '/gateway': {
      methods: ['GET'],
    },
    '/alert': {
      methods: ['GET'],
    },
    '/github': {
      methods: ['GET', 'POST'],
    },
    '/gcheck': {
      methods: ['POST'],
    },
    '/graphs': {
      methods: ['POST'],
    },
    '/cost': {
      methods: ['GET', 'PUT'],
    },
  };
  return allRoutes[url];
}

export default path;
