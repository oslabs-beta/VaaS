import { IPath, IPathRoute } from "../interfaces/IPath";

function path(url: string): IPathRoute {
  const allRoutes: IPath = {
    '/user': {
      methods: ['GET', 'PUT', 'DELETE']
    },
    '/auth': {
      methods: ['GET', 'POST', 'PUT']
    },
    '/cluster': {
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    },
    '/prom': {
      methods: ['GET']
    },
    '/faas': {
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    },
    '/faas/invoke': {
      methods: ['POST']
    }
  };
  return allRoutes[url];
}

export default path;
