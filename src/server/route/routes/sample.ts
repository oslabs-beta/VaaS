import router from '../router';
import { Request, Response } from "express";
import { Types } from 'mongoose';
import { Sample } from '../../models';
import { ISample } from "../../interfaces/ISample";
import { IError } from '../../interfaces/IError';
import example from '../../warehouse/middlewares/example';

router.route('/sample')
  .get(example, async (req: Request, res: Response) => {
    console.log(`Received ${req.method} request at api/sample`);
    try {
      return res.status(200).send('Success');
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfull GET request: ${err}`
      };
      console.log(err);
      res.status(error.status).json(error);
    }
  })
  .post(async (req: Request, res: Response) => {
    console.log(`Received ${req.method} request at api/sample`);
    try {
      return res.status(200).json();
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfull POST request: ${err}`
      };
      console.log(err);
      res.status(error.status).json(error);
    }
  })
  .put(async (req: Request, res: Response) => {
    console.log(`Received ${req.method} request at api/sample`);
    try {
      return res.status(200).json();
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfull PUT request: ${err}`
      };
      console.log(err);
      res.status(error.status).json(error);
    }
  })
  .delete(async (req: Request, res: Response) => {
    console.log(`Received ${req.method} request at api/sample`);
    try {
      return res.status(200).json();
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfull DELETE request: ${err}`
      };
      console.log(err);
      res.status(error.status).json(error);
    }
  });


export default router;
