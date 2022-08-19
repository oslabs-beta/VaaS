import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { IError } from '../../interfaces/IError';

export default async (req: Request, res: Response, next: (param?: unknown) => void): Promise<void> => {
  console.log(`Received ${req.method} request at 'bcrypt' middleware`);

  const { password } = req.body;
  const saltRounds = 10;

  /* REGISTER USER */
  if (!res.locals.hashedPassword) {
    res.locals.hashedPassword = await bcrypt.hash(password, saltRounds);
  }


  /* LOGIN USER */
  else {
    const result: boolean = await bcrypt.compare(password, res.locals.hashedPassword);
    // If username does not exist, send message to client saying "Invalid credentials"
    if (!result) {
      const error: IError = {
        status: 401,
        message: 'Invalid credentials received',
        invalid: true
      };
      res.status(error.status).json(error);
      return;
    }   
  }
  
  // Move to next middleware
  next();
}
