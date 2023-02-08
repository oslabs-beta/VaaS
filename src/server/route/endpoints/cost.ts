import router from '../router';
import { Request, Response } from 'express';
import { Cluster } from '../../models';
import { verifyCookie } from '../../warehouse/middlewares';
import { IError } from 'src/server/interfaces';

router
  .route('/cost')
  .get(verifyCookie, async (req: Request, res: Response) => {
    if (!req.query.clusterId) {
      const error: IError = {
        status: 500,
        message: 'Unable to fulfill request without clusterId',
      };
      return res.status(error.status).json(error);
    }
    try {
      const { clusterId } = req.query;
      const clusterMulti = await Cluster.find(
        { _id: clusterId },
        'multi'
      ).exec();
      if (clusterMulti.length === 0) {
        const error: IError = {
          status: 401,
          message: `Fail: Cluster multiplier does not exist`,
        };
        return res.status(error.status).json(error);
      }
      return res.status(201).json(clusterMulti[0].multi);
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfill ${req.method} request: ${err}`,
      };
      return res.status(error.status).json(error);
    }
  })
  .put(verifyCookie, async (req: Request, res: Response) => {
    if (!req.body.clusterId) {
      const error: IError = {
        status: 500,
        message: 'Unable to fulfill request without clusterId',
      };
      return res.status(error.status).json(error);
    }
    try {
      const { clusterId, name, multi } = req.body;
      const cluster = await Cluster.find({ _id: clusterId }).exec();
      if (cluster.length === 0) {
        const error: IError = {
          status: 401,
          message: `Fail: Cluster [${name}] does not exist`,
          exists: false,
        };
        return res.status(error.status).json(error);
      }
      await Cluster.updateOne({ _id: clusterId }, { multi: multi });
      console.log('from save button', multi);
      return res.status(201).json({ success: true });
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfill ${req.method} request: ${err}`,
      };
      return res.status(error.status).json(error);
    }
  });

export default router;
