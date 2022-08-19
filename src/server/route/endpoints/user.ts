import router from '../router';
import { Request, Response } from "express";
import { User } from '../../models';
import { IUser } from "../../interfaces/IUser";
import { IError } from '../../interfaces/IError';

router.route('/user')
  .get(async (req: Request, res: Response) => {
    console.log(`Received ${req.method} request at 'api/users'`)
    try {
      // const response = await User.find({ });
      // console.log('Documents successfully retrieved from MongoDB');
      return res.status(200).json();
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfull GET request: ${err}`
      };
      console.log(err);
      res.status(error.status).json(error);
    }
  })
  .put(async (req: Request, res: Response) => {
    console.log(`Received ${req.method} request at api/user`);
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
    console.log(`Received ${req.method} request at api/user`);
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
