import router from '../router';
import { Request, Response } from 'express';
import { User } from '../../models';
import { IError } from '../../interfaces/IError';
import {
  bcrypt,
  authUser,
  jwtCreator,
  jwtVerify,
} from '../../warehouse/middlewares';
import { terminal } from '../../services/terminal';

router
  .route('/auth')
  // VERIFIES IF USER's TOKEN IS ACTIVE AND VALID
  .get(jwtVerify, async (req: Request, res: Response) => {
    terminal(
      `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
    );
    try {
      terminal(`Success: Access to route is allowed`);
      return res.status(201).json({ invalid: false });
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfill ${req.method} request: ${err}`,
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
  })
  // create account
  .post(authUser, bcrypt, jwtCreator, async (req: Request, res: Response) => {
    terminal(
      `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
    );
    try {
      const { username, firstName, lastName } = req.body,
        { userId, hashedPassword, jwt } = res.locals;
      // CREATE AND SAVE A NEW USER WITH PROPERTIES DESTRUCTURED FROM req.body AND res.locals
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
      terminal(`Success: New user [${userId}] stored in MongoDB collection`);
      // SET x-auth-token IN RESPONSE HEADER TO BE JWT token
      return res
        .status(201)
        .header('x-auth-token', jwt)
        .json({ ...jwt, userId: userId });
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfill ${req.method} request: ${err}`,
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
  })
  // assign token when logging in
  .put(authUser, bcrypt, jwtCreator, async (req: Request, res: Response) => {
    terminal(
      `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
    );
    try {
      const { jwt, userId } = res.locals;
      terminal('Success: User login information authenticated');
      return res
        .status(201)
        .header('x-auth-token', jwt)
        .json({ ...jwt, userId });
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
