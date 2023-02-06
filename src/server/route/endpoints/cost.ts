import router from '../router';
import { Request, Response } from 'express';
import { Cluster } from '../../models';
import { verifyCookie } from '../../warehouse/middlewares';
import { IError } from 'src/server/interfaces';

router
  .route('/cost')
  .get()
  .put(verifyCookie, async (req: Request, res: Response) => {
    // console.log('this is put request');
    // console.log('clusterID', req.body.clusterId);
    // console.log('multi', req.body.multi);
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
      console.log('clusterid in try', clusterId);
      console.log('multi in try', multi);
      console.log('cluster in try', cluster);
      if (cluster.length === 0) {
        const error: IError = {
          status: 401,
          message: `Fail: Cluster [${name}] does not exist`,
          exists: false,
        };
        return res.status(error.status).json(error);
      }
      await Cluster.updateOne({ _id: clusterId }, multi);
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
