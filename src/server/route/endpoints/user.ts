import router from '../router';
import { Request, Response } from 'express';
import { User } from '../../models';
import { IError } from '../../interfaces/IError';
import { verifyCookie, bcrypt, authUser } from '../../warehouse/middlewares';
import { terminal } from '../../services/terminal';

router
  .route('/users') /* GETTING ALL USERS FROM DB:
VERIFIES USER's TOKEN, FETCHES ALL USERS IN DB. THROW ERROR IF NO USERS EXISTS, OTHERWISE SEND ALL USERS DETAILS TO THE CLIENT
*/
  .get(verifyCookie, async (req: Request, res: Response) => {
    terminal(
      `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
    );
    try {
      const users = await User.find({}).exec();
      if (users.length === 0) {
        const error: IError = {
          status: 401,
          message: `Fail: No user data exists`,
          exists: false,
        };
        terminal(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
      terminal(`Success: No user data exists in MongoDB collection`);
      return res.status(200).json(users);
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
  .route('/user')
  /* GETTING SPECIFIC USER USING USERNAME:
  VERIFIES USER's TOKEN, FINDS USER IN DB. IF USER EXISTS, SEND USER DETAILS TO CLIENT. ELSE THROW ERROR
  */
  .get(verifyCookie, async (req: Request, res: Response) => {
    terminal(
      `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
    );
    try {
      const user = await User.find({ username: res.locals.username });
      if (user.length === 0) {
        const error: IError = {
          status: 401,
          message: `Fail: User [${req.params['username']}] does not exist`,
          exists: false,
        };
        terminal(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
      terminal(
        `Success: User [${res.locals.username}] document retrieved from MongoDB collection`
      );
      // Can't use "delete" operator on mongoose query results unless you make a clone with toObject() method
      const newObj = user[0].toObject();
      delete newObj.cookieId;
      // console.log(newObj, 'cookieIdcookieIdcookieIdcookieIdcookieIdcookieId');
      return res.status(200).json(newObj);
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfill ${req.method} request: ${err}`,
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
  })
  /* UPDATING A USER DETAILS:
  VERIFIES USER's TOKEN, CHECKS IF USER EXISTS IN THE DB USING ID.
  THROWS ERROR IF NO USER IS FOUND, OTHERWISE UPDATES USERDATA RETURNED FROM DB WITH DESTRUCTURED FIELDS FROM THE CLIENT.
  */
  .put(verifyCookie, async (req: Request, res: Response) => {
    terminal(
      `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
    );
    const { username, firstName, lastName, darkMode, refreshRate } = req.body;
    try {
      terminal(`Searching for user [${username}] in MongoDB`);
      const user = await User.find({ username: res.locals.username }).exec();
      terminal(`Success: MongoDB query executed with [${username}]`);
      if (user.length === 0) {
        const error: IError = {
          status: 401,
          message: `Fail: User [${username}] does not exist`,
          exists: false,
        };
        terminal(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
      await User.updateOne(
        { username: res.locals.username },
        {
          username: username,
          firstName: firstName,
          lastName: lastName,
          darkMode: darkMode,
          refreshRate: refreshRate,
        }
      );
      terminal(`Success: User [${req.body.username}] document updated`);
      return res.status(201).json({ success: true });
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfill ${req.method} request: ${err}`,
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
  })
  // delete admin account
  .delete(
    authUser,
    bcrypt,
    verifyCookie,
    async (req: Request, res: Response) => {
      terminal(
        `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
      );
      try {
        const response = await User.deleteOne({ username: req.body.username });
        if (response.deletedCount === 0) {
          const error: IError = {
            status: 401,
            message: `Fail: User [${req.body.username}] either does not exist or could not be deleted`,
          };
          terminal(`Fail: ${error.message}`);
          return res.status(error.status).json({ error });
        }
        terminal(
          `Success: User [${req.body.username}] deleted from MongoDB collection`
        );
        return res.status(200).json({ deleted: true });
      } catch (err) {
        const error: IError = {
          status: 500,
          message: `Unable to fulfill ${req.method} request: ${err}`,
        };
        terminal(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
    }
  );
export default router;
