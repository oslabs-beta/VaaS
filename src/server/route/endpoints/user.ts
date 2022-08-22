import router from '../router';
import { Request, Response } from "express";
import { User } from '../../models';
import { IUser } from "../../interfaces/IUser";
import { IError } from '../../interfaces/IError';
import { jwtVerify, bcrypt, authUser } from '../../warehouse/middlewares';
import { terminal } from '../../services/terminal';

router.route('/user::username')
  .get(jwtVerify, async (req: Request, res: Response) => {
    terminal(`Received ${req.method} request at terminal 'api/user' endpoint`)
    try {
      const response = await User.find({ username: req.params['username'] })
      if (response.length === 0) {
        const error: IError = {
          status: 401,
          message: `Fail: User [${req.params['username']}] does not exist`
        };
        return res.status(error.status).json(error);
      }
      terminal(`Success: User [${req.params['username']}] document retrieved from MongoDB collection`);
      return res.status(200).json(response[0]);
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfull GET request: ${err}`
      };
      terminal(err);
      return res.status(error.status).json(error);
    }
  })
router.route('/user')
  .put(jwtVerify, async (req: Request, res: Response) => {
    terminal(`Received ${req.method} request at terminal 'api/user' endpoint`);
    try {
      return res.status(200).json();
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfull PUT request: ${err}`
      };
      terminal(err);
      return res.status(error.status).json(error);
    }
  })
  .delete(authUser, bcrypt, jwtVerify, async (req: Request, res: Response) => {
    terminal(`Received ${req.method} request at terminal 'api/user' endpoint`);
    try {
      const response = await User.deleteOne({ username: req.body.username })
      if (response.deletedCount === 0) {
        const error: IError = {
          status: 401,
          message: `Fail: User [${req.body.username}] either does not exist or could not be deleted`
        };
        return res.status(error.status).json({error});
      }
      terminal(`Success: New user [${req.body.username}] deleted from MongoDB collection`);
      return res.status(200).json({ deleted: true });
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfull DELETE request: ${err}`
      };
      terminal(err);
      return res.status(error.status).json(error);
    }
  });


export default router;
