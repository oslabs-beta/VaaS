import router from '../router';
import { Request, Response } from "express";
import fetch from "node-fetch";
import { Cluster } from '../../models';
import { IError } from '../../interfaces/IError';
import { jwtVerify } from '../../warehouse/middlewares';
import { terminal } from '../../services/terminal';

router.route('/faas::functionName')
.get(jwtVerify, async (req: Request, res: Response) => {
  terminal(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
  if (
    !req.headers.clusterId ||
    !req.params.functionName
  ) {
    const error: IError = {
      status: 500,
      message: 'Unable to fulfill request without all parameters (id, functionName) passed'
    };
    terminal(`Fail: ${error.message}`);
    return res.status(error.status).json(error);
  }
  const { clusterId } = req.headers;
  const { functionName } = req.params;
  try {
    const cluster = await Cluster.findOne({ _id: clusterId });
    if (cluster) {
      const { url, faas_port, authorization } = cluster;
      const functionInfo = await fetch(`${url}:${faas_port}/system/function/${functionName}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': authorization
        },
      })
      .then(res => res.json());
      terminal(`Success: OpenFaaS function [${functionName}] retrieved`);
      return res.status(200).json(functionInfo);
    } else {
      const error: IError = {
        status: 401,
        message: `Fail: Cluster [${clusterId}] does not exist`,
        exists: false
      };
      return res.status(error.status).json(error);
    }
  } catch (err) {
    const error: IError = {
      status: 500,
      message: `Unable to fulfill ${req.method} request: ${err}`
    };
    terminal(err);
    return res.status(error.status).json(error);
  }
});
router.route('/faas')
  .get(jwtVerify, async (req: Request, res: Response) => {
    terminal(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    if (
      !req.query.id ||
      !req.query.functionName
    ) {
      const error: IError = {
        status: 500,
        message: 'Unable to fulfill request without all parameters (id, functionName) passed'
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
    const { id } = req.query;
    try {
      const cluster = await Cluster.findOne({ _id: id });
      if (cluster) {
        const { url, faas_port, authorization } = cluster;
        const functionInfo = await fetch(`${url}:${faas_port}/system/functions`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': authorization
          },
        })
        .then(res => res.json());
        terminal(`Success: OpenFaaS functions retrieved`);
        return res.status(200).json(functionInfo);
      } else {
        const error: IError = {
          status: 401,
          message: `Fail: Cluster [${id}] does not exist`,
          exists: false
        };
        return res.status(error.status).json(error);
      }
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfill ${req.method} request: ${err}`
      };
      terminal(err);
      return res.status(error.status).json(error);
    }
  })
  .post(jwtVerify, async (req: Request, res: Response) => {
    terminal(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    // Validate request body
    if(
      !req.body.clusterId || 
      !req.body.service ||
      !req.body.image
    ) {
      const error: IError = {
        status: 500,
        message: 'Unable to fulfill request without all parameters (clusterId, service, image) passed'
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
    try {
      const { clusterId, service, image } = req.body;
      const cluster = await Cluster.findOne({ _id: clusterId });
      if (cluster) {
        const { url, faas_port, authorization } = cluster;
        const functionInfo = await fetch(`${url}:${faas_port}/system/functions`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': authorization
          },
          body: JSON.stringify({
            service,
            image
          })
        })
        .then(res => res.json());
        terminal(`Success: OpenFaaS function [${service}] posted`);
        return res.status(200).json(functionInfo);
      } else {
        const error: IError = {
          status: 401,
          message: `Fail: Cluster [${clusterId}] does not exist`,
          exists: false
        };
        return res.status(error.status).json(error);
      }
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfill ${req.method} request: ${err}`
      };
      terminal(err);
      return res.status(error.status).json(error);
    }
  });


export default router;