import { Request, Response } from 'express';
import { User } from '../../models';
import { IError } from '../../interfaces/IError';

export default async (req: Request, res: Response, next: (param?: unknown) => void): Promise<void | Response> => {
  console.log(`Received ${req.method} request at 'authUser' middleware`);
  try {
    // Look up username in mongoDb
    const { username } = req.body;
    console.log(`Searching for user [${username}] in MongoDB`);
    const user = await User.find({ username: username });
    console.log(`Success: MongoDB query executed [${username}]`);

    /* REGISTER USER */
    if (req.method === 'POST') {
      // Validate request body
      if (!req.body.username || !req.body.password || !req.body.firstName || !req.body.lastName) {
        const error: IError = {
          status: 500,
          message: 'Unable to fulfull request without all fields completed'
        };
        console.log(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
      // If username does exist, send boolean to client demonstrating "user already exists"
      if (user[0]) {
        const error: IError = {
          status: 401,
          message: `User [${user[0].username}] already exists`,
          exists: true
        };
        console.log(`Fail: ${error.message}`);
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
        console.log(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
      // If username does not exist, send message to client saying "Invalid credentials"
      if (!user[0]) {
        const error: IError = {
          status: 401,
          message: 'Invalid credentials received',
          invalid: true
        };
        console.log(`Fail: ${error.message}`);
        return res.status(error.status).json(error);
      }
      // If it does exist, save stored password to res.locals.hashedPassword
      console.log(`Success: User [${user[0].username}] found`);
      res.locals.hashedPassword = user[0].password;
    }

    // Move to next middleware
    console.log(`Success: Forwarding ${req.method} request to next middleware`);
    return next();
  } catch (err) {
    const error: IError = {
      status: 500,
      message: `Unable to fulfull request at '/auth' endpoint: ${err}`
    };
    console.log(err);
    return res.status(error.status).json(error);
  }
}
