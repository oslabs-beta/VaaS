import { Request, Response } from 'express';
import { User } from '../../models';
import { IError } from '../../interfaces/IError';
import { terminal } from '../../services/terminal';

export default async (req: Request, res: Response, next: (param?: unknown) => void): Promise<void | Response> => {
  terminal(`Received ${req.method} request at 'authUser' middleware`);
  try {
    if (!req.body.username) {
      const error: IError = {
        status: 500,
        message: 'Unable to fulfull request without username'
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
    const { username } = req.body;
    terminal(`Searching for user [${username}] in MongoDB`);
    const user = await User.find({ username: username });
    terminal(`Success: MongoDB query executed [${username}]`);
    /* REGISTER USER */
    if (req.method === 'POST') {
      // Validate request body
      if (
        !req.body.password || 
        !req.body.firstName || 
        !req.body.lastName
      ) {
        const error: IError = {
          status: 500,
          message: 'Unable to fulfull request without all fields completed'
        };
        terminal(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
      // If username does exist, send boolean to client demonstrating "user already exists"
      if (user[0]) {
        const error: IError = {
          status: 401,
          message: `User [${user[0].username}] already exists`,
          exists: true
        };
        terminal(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
    }
    /* LOGIN USER */
    if (
      (req.url === '/auth' && req.method === 'PUT') || 
      (req.url === '/user' && req.method === 'DELETE')
    ) {
      // Validate request body
      if (!req.body.username || !req.body.password) {
        const error: IError = {
          status: 500,
          message: 'Unable to fulfull request without all fields completed',
        };
        terminal(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
      // If username does not exist, send message to client saying "Invalid credentials"
      if (!user[0]) {
        const error: IError = {
          status: 401,
          message: 'Invalid credentials',
          invalid: true
        };
        terminal(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
      // If it does exist, save stored password to res.locals.hashedPassword
      terminal(`Success: User [${user[0].username}] found`);
      res.locals.hashedPassword = user[0].password;
      res.locals.userId = user[0]._id;
    }
    terminal(`Success: Forwarding ${req.method} request to next middleware`);
    return next();
  } catch (err) {
    const error: IError = {
      status: 500,
      message: `Unable to fulfull request at '${req.baseUrl}${req.url}' endpoint: ${err}`
    };
    terminal(err);
    return res.status(error.status).json(error);
  }
};
