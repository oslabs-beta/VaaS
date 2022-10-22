import { Request, Response } from 'express';
import { IError } from '../../interfaces/IError';
import { terminal } from '../../services/terminal';


export default async (req: Request, res: Response, next: (param?: unknown) => void): Promise<void | Response<any, Record<string, any>>> => {
  terminal(`Received ${req.method} request at 'gitAuthUser' middleware`);
  const { firstName, lastName, username, password } = res.locals.newAcctInfo;
  console.log('PASSWORD IS : ', password);
  try {
    // if user has account
    if (res.locals.hasAcct === true) {
      if (!username || !password) {
        const error: IError = {
          status: 500,
          message: 'Unable to fulfull request without all fields completed',
        };
        terminal(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
      // saving userId and password for next middleware
      res.locals.hashedPassword = res.locals.user.password;
      res.locals.userId = res.locals.user._id;

      terminal(`Success: Forwarding ${req.method} request to next middleware`);
      return next();
    }
    // if user not yet have acct
    else {
      if (
        !password ||
        !firstName ||
        !lastName
      ) {
        const error: IError = {
          status: 500,
          message: 'Unable to fulfull request without all fields completed'
        };
        terminal(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
      terminal(`Success: Forwarding ${req.method} request to next middleware`);
      return next();
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
};
