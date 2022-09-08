import router from '../router';
import { Request, Response } from "express";
import { User } from '../../models';
import { IError } from '../../interfaces/IError';
import { jwtVerify, bcrypt, authUser } from '../../warehouse/middlewares';
import { terminal } from '../../services/terminal';

router.route('/user::username')
  .get(jwtVerify, async (req: Request, res: Response) => {
    terminal(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    try {
      const user = await User.find({ username: req.params['username'] });
      if (user.length === 0) {
        const error: IError = {
          status: 401,
          message: `Fail: User [${req.params['username']}] does not exist`,
          exists: false
        };
        terminal(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
      terminal(`Success: User [${req.params['username']}] document retrieved from MongoDB collection`);
      return res.status(200).json(user[0]);
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfill ${req.method} request: ${err}`
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
  });
router.route('/user')
  .get(jwtVerify, async (req: Request, res: Response) => {
    terminal(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    try {
      const users = await User.find({ });
      if (users.length === 0) {
        const error: IError = {
          status: 401,
          message: `Fail: No user data exists`,
          exists: false
        };
        terminal(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
      terminal(`Success: No user data exists in MongoDB collection`);
      return res.status(200).json(users);
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfill ${req.method} request: ${err}`
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
  })
  .put(jwtVerify, async (req: Request, res: Response) => {
    terminal(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    const { username, firstName, lastName, darkMode, refreshRate } = req.body;
    const { jwt: { id } } = res.locals;
    try {
      // Check to see if cluster exists
      terminal(`Searching for user [${username}] in MongoDB`);
      const user = await User.find({ _id: id });
      terminal(`Success: MongoDB query executed [${username}]`);
      if (user.length === 0) {
        const error: IError = {
          status: 401,
          message: `Fail: User [${username}] does not exist`,
          exists: false
        };
        terminal(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
      await User.updateOne(
        { _id: id },
        {
          username: username,
          firstName: firstName,
          lastName: lastName,
          darkMode: darkMode,
          refreshRate: refreshRate
        }
      );
      terminal(`Success: User [${req.body.username}] document updated`);
      return res.status(201).json({ success: true });
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfill ${req.method} request: ${err}`
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
  })
  .delete(authUser, bcrypt, jwtVerify, async (req: Request, res: Response) => {
    terminal(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    try {
      const response = await User.deleteOne({ username: req.body.username });
      if (response.deletedCount === 0) {
        const error: IError = {
          status: 401,
          message: `Fail: User [${req.body.username}] either does not exist or could not be deleted`
        };
        terminal(`Fail: ${error.message}`);
        return res.status(error.status).json({error});
      }
      terminal(`Success: User [${req.body.username}] deleted from MongoDB collection`);
      return res.status(200).json({ deleted: true });
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfill ${req.method} request: ${err}`
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
  });


export default router;
