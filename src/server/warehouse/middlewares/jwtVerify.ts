import { Request, Response } from 'express';
import { decodeSession, checkExpStatus } from '../../services/jwt';
import { IError } from '../../interfaces/IError';

export default (req: Request, res: Response, next: (param?: unknown) => void): void | Response => {
  console.log(`Received ${req.method} request at 'jwtVerify' middleware`);
  if (req.method === 'GET') req.params['username'] = req.params['username'].substring(1);
  const authorized = decodeSession(process.env.JWT_ACCESS_SECRET, req.headers.authorization);
  if (authorized.type === 'valid') {
    const tokenStatus = checkExpStatus(authorized.session);
    if (tokenStatus === 'active') {
      console.log(`Success: JWT verified: [${req.headers.authorization}] for ${req.params['username']}`);
      return next();
    } else {
      const error: IError = {
        status: 401,
        message: `JWT is expired: [${req.headers.authorization}] for ${req.params['username']}`,
        invalid: true
      };
      console.log(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
  } else {
    const error: IError = {
      status: 401,
      message: `JWT not verified: [${req.headers.authorization}] for ${req.params['username']}`,
      invalid: true
    };
    console.log(`Fail: ${error.message}`);
    return res.status(error.status).json(error);
  }
};
