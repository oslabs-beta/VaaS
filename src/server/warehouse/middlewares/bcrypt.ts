import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { User } from '../../models';
import { IError } from '../../interfaces/IError';
import bcrypt from 'bcrypt';
import { terminal } from '../../services/terminal';

export default async (req: Request, res: Response, next: (param?: unknown) => void): Promise<void | Response> => {
  terminal(`Received ${req.method} request at 'bcrypt' middleware`);
  const { password } = req.body;
  const saltRounds = 10;
  /* REGISTER USER */
  if (!res.locals.hashedPassword) {
    res.locals.userId = new Types.ObjectId();
    res.locals.hashedPassword = await bcrypt.hash(password, saltRounds);
    terminal(`Success: Password hashed`);
  }
  /* LOGIN USER OR VERIFY PASSWORD FOR DELETE USER */
  else {
    const { username } = req.body;
    terminal(`Searching for user [${username}] in MongoDB`);
    const user = await User.find({ username: username });
    terminal(`Success: MongoDB query executed [${username}]`);
    res.locals.userId = user[0]._id;

    const result: boolean = await bcrypt.compare(password, res.locals.hashedPassword);
    if (!result) {
      const error: IError = {
        status: 401,
        message: 'Invalid credentials',
        invalid: true
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }   
  }
  terminal(`Success: Forwarding ${req.method} request to next middleware`);
  return next();
};