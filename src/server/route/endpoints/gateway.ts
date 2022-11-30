import router from '../router';
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { Cluster } from '../../models';
import { IError } from '../../interfaces/IError';
// import { jwtVerify } from "../../warehouse/middlewares";
import { verifyCookie } from '../../warehouse/middlewares';
import { terminal } from '../../services/terminal';

// to calculate OpenFaaS function cost e.g. avgTimePerInvoke
router
  .route('/gateway')
  .get(verifyCookie, async (req: Request, res: Response) => {
    terminal(
      `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
    );
    terminal(req.query);
    if (!req.query.id || !req.query.q) {
      const error: IError = {
        status: 500,
        message:
          'Unable to fulfill request without all parameters (id, q) passed',
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
    // id = cluster id, q = query string, type = type of query/function cost to calculate
    const { id, q, type } = req.query;
    console.log('q', q);

    try {
      const cluster = await Cluster.findOne({ _id: id }).exec();
      if (cluster) {
        const { url, k8_port } = cluster;

        const data = await fetch(`${url}:${k8_port}/api/v1/query?query=${q}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }).then((res) => res.json());
        terminal(`Success: PromQL query [${q}] executed`);
        // cleaning up the data send back to front end according to type of query it is
        if (type === 'avg') {
          const dataCleaned: { function_name: string; value: number } = {
            function_name: data.data.result[0].metric.function_name,
            value: data.data.result[0].value[1],
          };
          return res.status(200).json(dataCleaned);
        }
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
