import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { User } from '../../models';
import { IError } from '../../interfaces/IError';
import bcrypt from 'bcrypt';


export default async (req: Request, res: Response, next: (param?: unknown) => void): Promise<void | Response> => {
  console.log(`Received ${req.method} request at 'bcrypt' middleware`);

  const { password } = req.body;
  const saltRounds = 10;

  /* REGISTER USER */
  if (!res.locals.hashedPassword) {
    res.locals.userId = new Types.ObjectId();
    res.locals.hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(`Success: Password hashed`);
  }


  /* LOGIN USER */
  else {
    const { username } = req.body;
    console.log(`Searching for user [${username}] in MongoDB`);
    const user = await User.find({ username: username });
    console.log(`Success: MongoDB query executed [${username}]`);
    res.locals.userId = user[0]._id;

    const result: boolean = await bcrypt.compare(password, res.locals.hashedPassword);
    // If username does not exist, send message to client saying "Invalid credentials"
    if (!result) {
      const error: IError = {
        status: 401,
        message: 'Invalid credentials received',
        invalid: true
      };
      console.log('Fail: Invalid credentials received');
      return res.status(error.status).json(error);
    }   
  }
  
  // Move to next middleware
  console.log(`Success: Forwarding ${req.method} request to next middleware`);
  return next();
}
