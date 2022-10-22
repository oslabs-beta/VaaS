import router from '../router';
import { Request, Response } from "express";
import { terminal } from '../../services/terminal';
import { IError } from '../../interfaces/IError';
import { User } from '../../models';

import { bcrypt, gitAccessToken, gitAuthUser, jwtCreator } from '../../warehouse/middlewares';

router.route('/github')
  .post(gitAccessToken, gitAuthUser, bcrypt, jwtCreator, async (req: Request, res: Response) => {
    terminal(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    try {
      if (res.locals.hasAcct === false) {
        const { username, firstName, lastName } = res.locals.newAcctInfo, { userId, hashedPassword, jwt } = res.locals;
        const attempt = new User({
          _id: userId,
          username,
          password: hashedPassword,
          firstName,
          lastName,
          darkMode: false,
          refreshRate: 60000
        });
        await attempt.save();
        terminal(`Success: New user [${userId}] stored in MongoDB collection`);
        return res.status(201).header("x-auth-token", jwt).json({ ...jwt, userId: userId, name: username });
      }
      else {
        const { jwt, userId } = res.locals, { username, firstName } = res.locals.newAcctInfo;
        terminal('Success: User login information authenticated');
        return res.status(201).header("x-auth-token", jwt).json({ ...jwt, userId, name: username });
      }
    }
    catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfill ${req.method} request: ${err}`
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }

    // redirect to auth user to set header and create account
  });
export default router;

