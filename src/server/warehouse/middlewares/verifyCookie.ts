import { NextFunction, Request, Response } from 'express';
import { decodeSession, checkExpStatus, editSession } from '../../services/jwt';
import { terminal } from '../../services/terminal';
import User from '../../models/user';
import { IError } from '../../interfaces';

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  //get cookie from request
  const { cookieId } = req.cookies;
  const { baseUrl, url, method } = req;
  try {
    // send error to client if token does not exist
    if (!cookieId) {
      const error: IError = {
        status: 400,
        message: `User session has expired or something gone wrong.`,
      };
      return res.status(error.status).json({ ...error, invalid: true });
    }
    // query db with token from cookies to get user details
    const user = await User.findOne({ cookieId }).exec();
    if (user) {
      // authorized returns object with type and result as properties
      const authorized = decodeSession(process.env.JWT_ACCESS_SECRET, cookieId);
      //CHECK IF TOKEN IS VALID
      if (authorized.type === 'valid') {
        // CHECK TOKEN EXPIRATION STATUS
        const tokenStatus = checkExpStatus(authorized.session);
        if (tokenStatus === 'grace' && baseUrl === '/api' && url === '/auth') {
          // RENEW TOKEN SO SESSION TIME CAN START ALL OVER
          const token = await editSession(user, process.env.JWT_ACCESS_SECRET);
          // new token is saved into cookie, expiry time is not added as it is already encoded in the jwt token
          res.cookie('cookieId', token, { httpOnly: true });
          // return response to user if token that exist is the same as token saved to user in db
          return res.status(201).json({ invalid: false });
        }
        if (tokenStatus === 'active') {
          // IF TOKEN IS ACTIVE, SAVE USER's username to locals for the /user: route
          if (baseUrl === '/api' && url === '/auth' && method !== 'DELETE')
            return res.status(201).json({ invalid: false });
          if (
            (baseUrl === '/api' && url === '/user') ||
            (baseUrl === '/api' && url === '/auth' && method === 'DELETE')
          ) {
            res.locals.username = user.username;
            res.locals.id = user._id;
          }
          return next();
        } else {
          // RETURN ERROR IF TOKEN ISN'T ACTIVE
          const error: IError = {
            status: 401,
            message: `JWT is ${tokenStatus}: [${req.cookies.cookieId}]`,
            invalid: true,
          };
          terminal(`Fail: ${error.message}`);
          res.locals.error = error;
          //   return res.status(error.status).json(error);
        }
      }
      // IF TOKEN IS INVALID
      else {
        const error: IError = {
          status: 401,
          message: `JWT not verified: [${req.cookies.cookieId}]}`,
          invalid: true,
        };
        terminal(`Fail: ${error.message}`);
        res.locals.error = error;
        // return res.status(error.status).json(error);
      }
    }
    // if no user exists, return invalid to the client
    else {
      const error: IError = {
        status: 401,
        message: `JWT not found on any use: [${req.cookies.cookieId}]}`,
        invalid: true,
      };
      res.locals.error = error;
      res.status(500).json(error);
    }
  } catch (err) {
    const error: IError = {
      status: 500,
      message: `Internal Server Error`,
    };
    terminal(`Fail: ${error.message}`);
    res.locals.error = error;
  }
};
