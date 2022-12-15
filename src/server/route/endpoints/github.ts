import router from '../router';
import { Request, Response } from 'express';
import { terminal } from '../../services/terminal';
import { IError } from '../../interfaces/IError';
import { User } from '../../models';

import {
  bcrypt,
  gitAccessToken,
  gitAuthUser,
  jwtCreator,
} from '../../warehouse/middlewares';

router
  .route('/github')
  .post(
    gitAccessToken,
    gitAuthUser,
    bcrypt,
    jwtCreator,
    async (req: Request, res: Response) => {
      terminal(
        `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
      );
      try {
        // hasAcct IS FALSE IF USER's GITHUB INFO HAS BEEN GOTTEN BUT THE USER DOES NOT HAVE AN ACCOUNT YET
        if (res.locals.hasAcct === false) {
          const { username, firstName, lastName } = res.locals.newAcctInfo,
            { userId, hashedPassword, jwt } = res.locals;
          // CREATE AND SAVE A NEW USER WITH PROPERTIES DESTRUCTURED FROM res.locals.newAcctInfo AND res.locals
          const attempt = new User({
            _id: userId,
            username,
            password: hashedPassword,
            firstName,
            lastName,
            darkMode: false,
            refreshRate: 60000,
          });
          await attempt.save();
          terminal(
            `Success: New user [${userId}] stored in MongoDB collection`
          );
          // SET x-auth-token IN RESPONSE HEADER TO BE JWT token
          return res
            .status(201)
            .header('x-auth-token', jwt)
            .json({ ...jwt, userId, name: username });
        }
        // IF USER EXISTS IN DB, SEND RESPONSE TO THE CLIENT
        else {
          const { jwt, userId } = res.locals,
            { username } = res.locals.newAcctInfo;
          terminal('Success: User login information authenticated');
          return res
            .status(201)
            .header('x-auth-token', jwt)
            .json({ ...jwt, userId, name: username });
        }
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
