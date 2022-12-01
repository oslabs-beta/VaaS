import router from '../router';
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { Cluster } from '../../models';
import { IError } from '../../interfaces/IError';
// import { jwtVerify } from '../../warehouse/middlewares';
import { verifyCookie } from '../../warehouse/middlewares';
import { terminal } from '../../services/terminal';

// We're never hitting this prom route?

router.route('/prom').get(verifyCookie, async (req: Request, res: Response) => {
  terminal(
    `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
  );
  console.log(
    `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
  );
  console.log('WHAT THE FUCK!!!!!!!!!!!! THIS SHOULD FIRE???');
  terminal(req.query);
  terminal(`URL IS ${req.url}`);
  if (!req.query.id || !req.query.ns || !req.query.q) {
    const error: IError = {
      status: 500,
      message:
        'Unable to fulfill request without all parameters (id, ns, q) passed',
    };
    terminal(`Fail: ${error.message}`);
    return res.status(error.status).json(error);
  }
  // id = cluster ID, ns = namespace, q = query string
  const { id, ns, q } = req.query;
  try {
    const cluster = await Cluster.findOne({ _id: id }).exec();
    if (cluster) {
      const { url, k8_port, faas_port } = cluster;
      let port: number;
      // assign port based on namespace provided by the client
      switch (ns) {
        case 'k8':
          port = k8_port;
          break;
        case 'faas':
          port = faas_port;
          break;
        default: {
          const error: IError = {
            status: 401,
            message: `Fail: Invalid namespace [${ns}] passed (k8 || faas)`,
          };
          return res.status(error.status).json(error);
        }
      }
      // make prometheus query with provided info to get metrics
      const metric = await fetch(`${url}:${port}/api/v1/query?query=${q}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());
      terminal(`Success: PromQL query [${q}] executed`);
      return res.status(200).json(metric);
    } else {
      const error: IError = {
        status: 401,
        message: `Fail: Cluster [${id}] does not exist`,
        exists: false,
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
  } catch (err) {
    const error: IError = {
      status: 500,
      message: `Unable to fulfill ${req.method} request: ${err}`,
    };
    terminal(`Fail: ${error.message}`);
    return res.status(error.status).json(error);
  }
});

export default router;
