import router from '../router';
import { Request, Response } from 'express';
import { verifyCookie } from '../../warehouse/middlewares';
import { IChart, IError } from '../../interfaces';
import { terminal } from '../../services/terminal';
import axios from 'axios';

router
  .route('/graphs')
  .post(verifyCookie, async (req: Request, res: Response) => {
    try {
      const { grafanaUrl }: { grafanaUrl: string } = req.body;
      const { data }: { data: IChart[] } = await axios.get(
        `${grafanaUrl}/api/search`
      );
      const chartData: Record<string, string> = {};
      const regex: RegExp = /(\w*)(Kubernetes|Resources|\/)/g;
      data.forEach((ele: IChart) => {
        const title: string = ele.title
          .replaceAll(regex, '')
          .replaceAll(' ', '')
          .replaceAll('(', '')
          .replaceAll(')', '');
        chartData[title] = ele.uid;
      });
      res.status(200).json(chartData);
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
