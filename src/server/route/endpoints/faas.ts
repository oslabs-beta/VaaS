import router from '../router';
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { Cluster } from '../../models';
import { IError } from '../../interfaces/IError';
import { verifyCookie } from '../../warehouse/middlewares';
import { terminal } from '../../services/terminal';

router
  .route('/faas::functionName')
  // Getting specific OpenFaaS function using functionName param:
  // Verifies user's token
  .get(verifyCookie, async (req: Request, res: Response) => {
    terminal(
      `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
    );
    // validate clusterid and functionName
    if (!req.headers.clusterid || !req.params.functionName) {
      const error: IError = {
        status: 500,
        message:
          'Unable to fulfill request without all parameters (id, functionName) passed',
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
    const { clusterid } = req.headers;
    const { functionName } = req.params;
    try {
      // find cluster in DB using clusterId
      const cluster = await Cluster.findOne({ _id: clusterid }).exec();
      if (cluster) {
        // destructure properties from fetched cluster and make a request to OpenFaaS to fetch OpenFaaS function
        const { faas_url, faas_port, authorization } = cluster;
        const functionInfo = await fetch(
          `${faas_url}:${faas_port}/system/function/${functionName}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: authorization,
            },
          }
        ).then((res) => res.json());
        terminal(
          `Success: OpenFaaS function [${functionName} @ ${faas_url}:${faas_port}] retrieved`
        );
        // return functionInfo to the client
        return res.status(200).json(functionInfo);
      } else {
        const error: IError = {
          status: 401,
          message: `Fail: Cluster [${clusterid}] does not exist`,
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
router
  .route('/faas')
  // Fetching all OpenFaas functions:
  // Verifies user's token
  .get(verifyCookie, async (req: Request, res: Response) => {
    terminal(
      `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
    );
    // if OpenFaaSStore exists in the request queries
    if (req.query.OpenFaaSStore) {
      // make request to get all OpenFaaS functions
      try {
        const functions = await fetch(
          'https://raw.githubusercontent.com/openfaas/store/master/functions.json'
        ).then((res) => res.json());
        terminal(`Success: OpenFaaS Store functions retrieved`);
        // return functions to the client
        return res.status(200).json(functions);
      } catch (err) {
        const error: IError = {
          status: 500,
          message: `Unable to fulfill ${req.method} request: ${err}`,
        };
        terminal(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
    }
    // if OpenFaaSStore doesn't exist, check headers for cluster id, find cluster in DB using the id and make a request to the custom OpenFaaS url
    if (!req.headers.id) {
      const error: IError = {
        status: 500,
        message: 'Unable to fulfill request without parameter (id) passed',
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
    const { id } = req.headers;
    try {
      // get single cluster using id
      const cluster = await Cluster.findOne({ id }).exec();
      if (cluster) {
        // destructure cluster info and fetch all OpenFaaS functions from OpenFaaS custom url
        const { faas_url, faas_port, authorization } = cluster;
        const functionInfo = await fetch(
          `${faas_url}:${faas_port}/system/functions`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: authorization,
            },
          }
        ).then((res) => res.json());
        terminal(`Success: Deployed OpenFaaS functions retrieved`);
        return res.status(200).json(functionInfo);
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
        message: `Unable to fulfill ${req.method} request: ${err} @ line 138 faas.ts`,
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
  })
  // Deploy a new OpenFaas function:
  // Verify user's token
  .post(verifyCookie, async (req: Request, res: Response) => {
    terminal(
      `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
    );
    // Validate request body
    if (!req.body.clusterId || !req.body.service || !req.body.image) {
      const error: IError = {
        status: 500,
        message:
          'Unable to fulfill request without all parameters (clusterId, service, image) passed',
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
    try {
      const { clusterId, service, image } = req.body;
      const cluster = await Cluster.findOne({ _id: clusterId });
      if (cluster) {
        const { faas_url, faas_port, authorization } = cluster;
        // deploy new OpenFaaS function with service and image, where service is the function
        await fetch(`${faas_url}:${faas_port}/system/functions`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: authorization,
          },
          body: JSON.stringify({
            service,
            image,
          }),
        });
        terminal(`Success: OpenFaaS function [${service}] deployed`);
        return res.status(200).json({ success: true });
      } else {
        const error: IError = {
          status: 401,
          message: `Fail: Cluster [${clusterId}] does not exist`,
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
  })
  // Delete a function:
  .delete(async (req: Request, res: Response) => {
    terminal(
      `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
    );
    if (!req.body.clusterId || !req.body.functionName) {
      const error: IError = {
        status: 500,
        message:
          'Unable to fulfill request without all parameters (clusterId, functionName) passed',
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
    try {
      const { clusterId, functionName } = req.body;
      const cluster = await Cluster.findOne({ _id: clusterId }).exec();
      if (cluster) {
        const { faas_url, faas_port, authorization } = cluster;
        // delete functionName from custom OpenFaaS function store
        await fetch(`${faas_url}:${faas_port}/system/functions`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: authorization,
          },
          body: JSON.stringify({
            functionName,
          }),
        }).then((res) => res.text());
        terminal(`Success: OpenFaaS function [${functionName}] deleted`);
        return res.status(200).json({ success: true });
      } else {
        const error: IError = {
          status: 401,
          message: `Fail: Cluster [${clusterId}] does not exist`,
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
// Invokes selected OpenFaaS function on a cluster
router
  .route('/faas/invoke')
  .post(verifyCookie, async (req: Request, res: Response) => {
    terminal(
      `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
    );
    if (!req.body.clusterId || !req.body.functionName) {
      const error: IError = {
        status: 500,
        message:
          'Unable to fulfill request without all parameters (clusterId, functionName) passed',
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
    try {
      const { clusterId, functionName, data } = req.body;
      const cluster = await Cluster.findOne({ _id: clusterId }).exec();
      if (cluster && data) {
        const { faas_url, faas_port, authorization } = cluster;
        const body = data;
        const func = await fetch(
          `${faas_url}:${faas_port}/function/${functionName}`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: authorization,
            },
            body: body,
          }
        ).then((res) => res.text());
        terminal(`Success: OpenFaaS function [${functionName}] invoked`);
        return res.status(200).json(func);
      } else if (cluster && !data) {
        const { faas_url, faas_port, authorization } = cluster;
        const func = await fetch(
          `${faas_url}:${faas_port}/function/${functionName}`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: authorization,
            },
          }
        ).then((res) => res.text());
        terminal(`Success: OpenFaaS function [${functionName}] invoked`);
        return res.status(200).json(func);
      } else {
        const error: IError = {
          status: 401,
          message: `Fail: Cluster [${clusterId}] does not exist`,
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
