import { Request, Response, NextFunction } from 'express';
import { decodeSession, checkExpStatus } from '../../services/jwt';
import { IError } from '../../interfaces/IError';
import { terminal } from '../../services/terminal';

export default (req: Request, res: Response, next: NextFunction): void | Response => {
  terminal(`Received ${req.method} request at 'jwtVerify' middleware`);
  // DECODE USER's JWT TOKEN
  const authorized = decodeSession(process.env.JWT_ACCESS_SECRET, req.headers.authorization);
  console.log(authorized);
  // VERIFY IF DECODED USER's JWT TOKEN IS VALID
  if (authorized.type === 'valid') {
    // SAVE DECODED USER DETAILS TO LOCALS
    res.locals.jwt = authorized.session;
    // CHECK USER's TOKEN EXPIRATION STATUS
    const tokenStatus = checkExpStatus(authorized.session);
    console.log(tokenStatus);
    // MOVE ON TO NEXT MIDDLEWARE IF USER's JWT TOKEN IS ACTIVE
    if (tokenStatus === 'active') {
      terminal(`Success: JWT is ${tokenStatus}: [${req.headers.authorization}]`);
      console.log(`Success: JWT is ${tokenStatus}: [${req.headers.authorization}]`);
      return next();
    } else {
      // RETURN ERROR WITH tokenStatus IF USER's JWT TOKEN ISN'T ACTIVE
      const error: IError = {
        status: 401,
        message: `JWT is ${tokenStatus}: [${req.headers.authorization}]`,
        invalid: true,
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
  } else {
    // USER's JWT TOKEN IS NOT VERIFIED AS VALID: RETURN ERROR
    const error: IError = {
      status: 401,
      message: `JWT not verified: [${req.headers.authorization}]}`,
      invalid: true,
    };
    terminal(`Fail: ${error.message}`);
    return res.status(error.status).json(error);
  }
};
