import { IPath, IPathRoute } from "../interfaces/IPath";

// ALL API REQUESTS ARE PROCESSED IN IPATH TO DETERMINE TYPE OF REQUEST
function path(url: string): IPathRoute {
  const allRoutes: IPath = {
    "/user": {
      methods: ["GET", "PUT", "DELETE"]
    },
    "/auth": {
      methods: ["POST", "PUT"]
    }
  }
  return allRoutes[url];
}

export default path;
