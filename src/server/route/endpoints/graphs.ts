import router from '../router';
import { Request, Response } from 'express';
import { verifyCookie } from '../../warehouse/middlewares';
import { IChart } from '../../interfaces';
import axios from 'axios';

router
  .route('/graphs')
  .get(verifyCookie, async (req: Request, res: Response) => {
    const { data }: { data: IChart[] } = await axios.get(
      'http://34.121.177.99/api/search'
    );
    const chartData: Record<string, string> = {};
    const regex = /(\w*)(Kubernetes|Resources|\/)/g;
    data.forEach((ele: IChart) => {
      const title: string = ele.title
        .replaceAll(regex, '')
        .replaceAll(' ', '')
        .replaceAll('(', '')
        .replaceAll(')', '');
      chartData[title] = ele.uid;
    });
    // console.log(chartData);
    res.status(200).json(chartData);
  });

export default router;
