import { Request, Response } from 'express';
import { User } from '../../models';
import { IError } from '../../interfaces/IError';

export default async (req: Request, res: Response, next: (param?: unknown) => void): Promise<void> => {
  console.log(`Received ${req.method} request at 'authUser' middleware`);
  try {
    // Look up username in mongoDb
    const { username } = req.body;
    console.log('Searching for document in MongoDB');
    const user = await User.find({ username: username });
    console.log('MongoDB query successfully executed:');

    /* REGISTER USER */
    if (req.method === "POST") {
      // Validate request body
      if (!req.body.username || !req.body.password || !req.body.firstName || !req.body.lastName) {
        const error: IError = {
          status: 500,
          message: 'Unable to fulfull request without all fields completed'
        };
        res.status(error.status).json(error);
        return;
      }
      // If username does exist, send boolean to client demonstrating "user already exists"
      console.log(user);
      if (user[0]) {
        const error: IError = {
          status: 401,
          message: 'User already exists',
          exists: true
        };
        res.status(error.status).json(error);
        return;
      }
    }


    /* LOGIN USER */
    if (req.method === "PUT") {
      // Validate request body
      if (!req.body.username || !req.body.password) {
        const error: IError = {
          status: 500,
          message: 'Unable to fulfull request without all fields completed',
        };
        res.status(error.status).json(error);
        return;
      }
      // If username does not exist, send message to client saying "Invalid credentials"
      if (!user[0]) {
        const error: IError = {
          status: 401,
          message: 'Invalid credentials received',
          invalid: true
        };
        res.status(error.status).json(error);
        return;
      }
      // If it does exist, save stored password to res.locals.hashedPassword
      res.locals.hashedPassword = user[0].password;
    }

    // Move to next middleware
    next();
  } catch (err) {
    const error: IError = {
      status: 500,
      message: `Unable to fulfull request at '/auth' endpoint: ${err}`
    };
    console.log(err);
    res.status(error.status).json(error);
    return;
  }
}
