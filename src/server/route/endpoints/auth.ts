import router from '../router';
import { Request, Response } from 'express';
import { User } from '../../models';
import { IError } from '../../interfaces/IError';
import {
  bcrypt,
  authUser,
  jwtCreator,
  verifyCookie,
} from '../../warehouse/middlewares';
import { terminal } from '../../services/terminal';

router
  .route('/auth')
  // VERIFIES IF USER's TOKEN IS ACTIVE AND VALID
  .get(verifyCookie)
  // create account
  .post(authUser, bcrypt, jwtCreator, async (req: Request, res: Response) => {
    terminal(
      `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
    );
    try {
      const { username, firstName, lastName } = req.body,
        { userId, hashedPassword, jwt } = res.locals;
      res.cookie('cookieId', jwt.token, { httpOnly: true });
      // CREATE AND SAVE A NEW USER WITH PROPERTIES DESTRUCTURED FROM req.body AND res.locals
      const attempt = new User({
        _id: userId,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        darkMode: false,
        refreshRate: 60000,
        cookieId: jwt.token,
      });
      await attempt.save();
      terminal(`Success: New user [${userId}] stored in MongoDB collection`);
      // SET x-auth-token IN RESPONSE HEADER TO BE JWT token
      //console.log('line 39 userID', userId);
      return res
        .status(201)
        .header('x-auth-token', jwt.token)
        .json({ userId: userId });
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfill ${req.method} request: ${err}`,
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
  })
  // logging user in
  .put(authUser, bcrypt, jwtCreator, async (req: Request, res: Response) => {
    terminal(
      `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
    );
    try {
      const { jwt, userId } = res.locals;
      res.cookie('cookieId', jwt.token, { httpOnly: true });
      // update user cookieId with ntoken created during login
      await User.findOneAndUpdate(
        { _id: userId },
        { cookieId: jwt.token },
        { new: true }
      ).exec();
      //console.log('Line 68 userID', userId);
      terminal('Success: User login information authenticated');
      return res.status(201).header('x-auth-token', jwt.token).json({ userId });
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfill ${req.method} request: ${err}`,
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
  })
  .delete(verifyCookie, async (req: Request, res: Response) => {
    const id = res.locals.id;
    res.clearCookie('cookieId');
    await User.findOneAndUpdate({ id }, { cookieId: '' }, { new: true }).exec();
    // res.cookie('cookieId', '', { httpOnly: true });
    return res.status(200).json({ valid: false });
  });

export default router;
